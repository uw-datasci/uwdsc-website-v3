import { GetReceivingEmailResponseSuccess } from "resend";
import { MembershipRepository } from "./membership.repository";
import { ApiError, MarkAsPaidData, MembershipStats } from "@uwdsc/common/types";
import {
  assertReceiptWithinActiveTerm,
  parseMembershipReceipt,
  dedupeRecipients,
  throwIfParseFailed,
} from "../../utils/membershipReceipt";
import { emailService } from "../email/email.service";
import { profileService } from "./profile.service";

class MembershipService {
  private readonly repository: MembershipRepository;

  constructor() {
    this.repository = new MembershipRepository();
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
    data: MarkAsPaidData,
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
   */
  async processEmailReceipt(
    email: GetReceivingEmailResponseSuccess,
    termStartDate: string | null,
  ): Promise<void> {
    let recipientEmails: string[] = [];

    try {
      const body = email.text;
      if (!body) throw new ApiError("Email body is missing", 400);

      const parsed = parseMembershipReceipt(body);
      recipientEmails = dedupeRecipients(parsed.toRecipientEmail, parsed.receiptEmail);
      throwIfParseFailed(parsed);

      const { receiptEmail, transactionDateText } = parsed;

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
        if (recipientEmails.length > 0) {
          await emailService
            .sendMembershipReceiptNotice(recipientEmails, { kind: "already_verified" })
            .catch((e) =>
              console.error("[MembershipService] Already-verified notice email failed:", e),
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

      if (recipientEmails.length > 0) {
        await emailService
          .sendMembershipReceiptNotice(recipientEmails, { kind: "welcome" })
          .catch((e) => console.error("[MembershipService] Success notice email failed:", e));
      }
    } catch (error) {
      if (recipientEmails.length > 0) {
        await emailService
          .sendMembershipReceiptNotice(recipientEmails, { kind: "failure" })
          .catch((e) => console.error("[MembershipService] Failure notice email failed:", e));
      }

      if (error instanceof ApiError) throw error;
      throw new ApiError(
        `Failed to process membership payment email: ${(error as Error).message}`,
        500,
      );
    }
  }
}

export const membershipService = new MembershipService();
