import { GetReceivingEmailResponseSuccess } from "resend";
import { MembershipRepository } from "./membership.repository";
import { ApiError, MarkAsPaidData, MembershipStats } from "@uwdsc/common/types";
import {
  assertForwarderMatchesReceipt,
  assertReceiptWithinActiveTerm,
  parseMembershipReceipt,
  parseUwaterlooEmailAddress,
  dedupeRecipients,
  throwIfParseFailed,
} from "../../utils/membershipReceipt";
import { emailService } from "../email/email.service";
import { profileService } from "./profile.service";
import { EmailReceiptRepository } from "./emailReceipt.repository";

class MembershipService {
  private readonly repository: MembershipRepository;
  private readonly receiptRepository: EmailReceiptRepository;

  constructor() {
    this.repository = new MembershipRepository();
    this.receiptRepository = new EmailReceiptRepository();
  }

  /**
   * Get membership statistics
   */
  async getMembershipStats(): Promise<MembershipStats> {
    try {
      return await this.repository.getMembershipStats();
    } catch (error) {
      throw new ApiError(`Failed to get membership stats: ${(error as Error).message}`, 500);
    }
  }

  /**
   * Mark a member as paid
   */
  async markMemberAsPaid(
    profileId: string,
    data: MarkAsPaidData
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const result = await this.repository.markAsPaid(profileId, data);

      if (!result) return { success: false, error: "Failed to create membership record" };

      return { success: true };
    } catch (error) {
      throw new ApiError(`Failed to mark member as paid: ${(error as Error).message}`, 500);
    }
  }

  /**
   * Process a membership payment email.
   *
   * The forwarded email is archived before anything else, so a receipt is never
   * lost to a parse failure or an unrecognised sender. A clean receipt lands in
   * the same review queue the web form writes to, already approved; anything
   * else lands there as `pending` for an exec to judge.
   */
  async processEmailReceipt(
    email: GetReceivingEmailResponseSuccess,
    termStartDate: string | null,
    forwarderFrom: string
  ): Promise<void> {
    let recipientEmails: string[] = [];

    // Archive first. Resend delivers at-least-once, so a replay is a no-op.
    await this.receiptRepository
      .recordReceipt({
        resendEmailId: email.id,
        fromAddress: forwarderFrom,
        toAddress: email.to?.[0] ?? null,
        subject: email.subject ?? null,
        receivedAt: email.created_at ?? null,
        textBody: email.text,
        htmlBody: email.html,
        rawPayload: email,
      })
      .catch((e) => {
        // Archiving is not worth failing the webhook over -- verification still
        // has to run.
        console.error("[MembershipService] Failed to archive inbound email:", e);
        return null;
      });

    try {
      const body = email.text;
      if (!body) throw new ApiError("Email body is missing", 400);

      const forwarderEmail = parseUwaterlooEmailAddress(forwarderFrom);
      const parsed = parseMembershipReceipt(body);
      recipientEmails = dedupeRecipients(forwarderEmail, parsed.receiptEmail);
      throwIfParseFailed(parsed);

      const { receiptEmail, transactionDateText } = parsed;

      assertForwarderMatchesReceipt(forwarderFrom, receiptEmail);

      assertReceiptWithinActiveTerm(transactionDateText, termStartDate);

      const profile = await profileService.getProfileByEmail(receiptEmail);
      if (!profile) throw new ApiError("No profile found for receipt email", 404);

      const targetTermId = await this.repository.resolveTargetTermIdForProfile(profile.id);
      if (!targetTermId) throw new ApiError("Could not resolve membership term", 400);

      const existing = await this.repository.getMembershipByProfile(profile.id);
      if (
        existing !== null &&
        existing.term_id === targetTermId &&
        existing.payment_method === "online"
      ) {
        await this.linkReceipt(email.id, profile.id, targetTermId, profile, "approved");

        if (recipientEmails.length > 0) {
          await emailService
            .sendMembershipReceiptNotice(recipientEmails, {
              kind: "already_verified",
            })
            .catch((e) =>
              console.error("[MembershipService] Already-verified notice email failed:", e)
            );
        }
        return;
      }

      const markResult = await this.markMemberAsPaid(profile.id, {
        payment_method: "online",
        payment_location: "WUSA Online Shop",
        verifier: null,
      });

      if (!markResult.success) {
        console.error("Failed to mark member as paid");
        throw new ApiError(markResult.error ?? "Failed to mark member as paid", 400);
      }

      // Approving here also settles any pending web-form submission for the same
      // term: the member paid and forwarded proof, so there is nothing left to review.
      await this.linkReceipt(email.id, profile.id, targetTermId, profile, "approved");

      if (recipientEmails.length > 0) {
        await emailService
          .sendMembershipReceiptNotice(recipientEmails, { kind: "welcome" })
          .catch((e) => console.error("[MembershipService] Success notice email failed:", e));
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";

      // Best-effort: if the sender maps to a real account, leave a pending
      // submission an exec can act on rather than dropping the receipt.
      await this.quarantineFailedReceipt(email.id, forwarderFrom, message);

      if (recipientEmails.length > 0) {
        await emailService
          .sendMembershipReceiptNotice(recipientEmails, { kind: "failure" })
          .catch((e) => console.error("[MembershipService] Failure notice email failed:", e));
      }

      if (error instanceof ApiError) throw error;
      throw new ApiError(`Failed to process membership payment email: ${message}`, 500);
    }
  }

  /** Attach an archived receipt to a submission in the review queue. */
  private async linkReceipt(
    resendEmailId: string,
    profileId: string,
    termId: string,
    profile: {
      first_name: string | null;
      last_name: string | null;
      wat_iam: string | null;
      email: string;
    },
    status: "approved" | "pending"
  ): Promise<void> {
    try {
      const submissionId = await this.receiptRepository.upsertEmailSubmission({
        profileId,
        termId,
        firstName: profile.first_name ?? "",
        lastName: profile.last_name ?? "",
        watIam: profile.wat_iam ?? "",
        contactEmail: profile.email,
        status,
      });

      await this.receiptRepository.finalizeReceipt(
        resendEmailId,
        status === "approved" ? "parsed" : "failed",
        null,
        profileId,
        submissionId
      );
    } catch (e) {
      console.error("[MembershipService] Failed to link email receipt to submission:", e);
    }
  }

  /**
   * A receipt we could not verify. If the forwarder maps to an account, put a
   * pending submission in the queue; otherwise the archived receipt stands alone.
   */
  private async quarantineFailedReceipt(
    resendEmailId: string,
    forwarderFrom: string,
    parseError: string
  ): Promise<void> {
    try {
      const forwarderEmail = parseUwaterlooEmailAddress(forwarderFrom);
      const profile = forwarderEmail
        ? await profileService.getProfileByEmail(forwarderEmail)
        : null;

      if (!profile) {
        await this.receiptRepository.finalizeReceipt(
          resendEmailId,
          "failed",
          parseError,
          null,
          null
        );
        return;
      }

      const termId = await this.repository.resolveTargetTermIdForProfile(profile.id);
      if (!termId) {
        await this.receiptRepository.finalizeReceipt(
          resendEmailId,
          "failed",
          parseError,
          profile.id,
          null
        );
        return;
      }

      const submissionId = await this.receiptRepository.upsertEmailSubmission({
        profileId: profile.id,
        termId,
        firstName: profile.first_name ?? "",
        lastName: profile.last_name ?? "",
        watIam: profile.wat_iam ?? "",
        contactEmail: profile.email,
        status: "pending",
      });

      await this.receiptRepository.finalizeReceipt(
        resendEmailId,
        "failed",
        parseError,
        profile.id,
        submissionId
      );
    } catch (e) {
      console.error("[MembershipService] Failed to quarantine email receipt:", e);
    }
  }
}

export const membershipService = new MembershipService();
