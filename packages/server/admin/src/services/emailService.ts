import { render } from "@react-email/render";
import { createElement } from "react";
import { Resend } from "resend";
import { ApiError } from "@uwdsc/common/types";
import { CampaignEmail } from "../email-templates/campaign";
import {
  ExecWelcomeEmail,
  getExecWelcomeSubject,
} from "../email-templates/execWelcome";
import {
  HiringDecisionEmail,
  getHiringDecisionSubject,
} from "../email-templates/hiringDecision";
import {
  MembershipReceipt,
  getMembershipReceiptSubject,
} from "../email-templates/membershipReceipt";
import { appendUnsubscribeFooter } from "../utils/marketingEmail";

type MarketingSegmentBroadcastResult = {
  id?: string;
  recipientEmails: string[];
};

type SendMarketingSegmentBroadcastParams = {
  subject: string;
  emailHtml: string;
  recipientEmails: string[];
  onEmptyRecipients: "throw" | "skip";
  emptyRecipientsMessage?: string;
};

class EmailService {
  private readonly resend: Resend | null;
  private readonly from: string;
  private readonly campaignSegmentId: string;

  /**
   * Wait this long after a broadcast before removing contacts from the scratch segment,
   * so Resend can resolve segment membership before cleanup.
   */
  readonly campaignSegmentCleanupDelayMs = 90000; // 90 seconds

  constructor() {
    const key = process.env.RESEND_API_KEY;
    this.resend = key ? new Resend(key) : null;
    this.from =
      process.env.RESEND_FROM_EMAIL ??
      "UW Data Science Club <noreply@mail.uwdatascience.ca>";

    this.campaignSegmentId = process.env.RESEND_CAMPAIGN_SEGMENT_ID ?? "";
    if (!this.campaignSegmentId) {
      throw new ApiError(
        "RESEND_CAMPAIGN_SEGMENT_ID is not set. Create a segment in Resend and add its id for marketing broadcasts.",
        500,
        "Configuration error",
      );
    }
  }

  /**
   * Generic transactional send via Resend (not broadcast; no marketing footer).
   */
  private async sendTransactionalEmail(params: {
    to: string[];
    subject: string;
    html: string;
  }): Promise<void> {
    if (params.to.length === 0) return;

    if (!this.resend) {
      console.warn(
        "[EmailService] Transactional send skipped: RESEND_API_KEY not set",
      );
      return;
    }

    const { error } = await this.resend.emails.send({
      from: this.from,
      to: params.to,
      subject: params.subject,
      html: params.html,
    });

    if (error) {
      console.error("Resend transactional email error:", error);
      throw new ApiError(
        this.resendErrorMessage(error) ?? "Failed to send transactional email",
        500,
      );
    }
  }

  /**
   * Create and send a Resend Broadcast (marketing) to the configured segment.
   */
  private async sendMarketingBroadcast(params: {
    segmentId: string;
    subject: string;
    html: string;
  }): Promise<{ id?: string }> {
    if (!this.resend)
      throw new ApiError("Email service is not configured", 500);

    const { data, error } = await this.resend.broadcasts.create({
      segmentId: params.segmentId,
      from: this.from,
      subject: params.subject,
      html: params.html,
      name: `UWDSC admin campaign ${new Date().toISOString()}`,
      send: true,
    });

    if (error) {
      console.error("Resend broadcast error:", error);
      const message =
        this.resendErrorMessage(error) ?? "Failed to send campaign broadcast";
      throw new ApiError(message, 500, "Failed to send campaign");
    }

    return { id: data?.id };
  }

  private resendErrorMessage(error: unknown): string | undefined {
    if (
      typeof error === "object" &&
      error !== null &&
      "message" in error &&
      typeof (error as { message: unknown }).message === "string"
    ) {
      return (error as { message: string }).message;
    }
    return undefined;
  }

  /**
   * Ensures each address exists as a Resend contact and is in the campaign segment.
   */
  private async ensureRecipientsInSegment(
    emails: string[],
    segmentId: string,
  ): Promise<void> {
    if (!this.resend) {
      throw new ApiError("Email service is not configured", 500);
    }

    for (const email of emails) {
      const created = await this.resend.contacts.create({
        email,
        unsubscribed: false,
        segments: [{ id: segmentId }],
      });

      if (!created.error) {
        continue;
      }

      const added = await this.resend.contacts.segments.add({
        email,
        segmentId,
      });

      if (added.error) {
        const msg =
          this.resendErrorMessage(created.error) ??
          this.resendErrorMessage(added.error) ??
          "Failed to add recipient to campaign segment";
        throw new ApiError(msg, 400, "Validation error");
      }
    }
  }

  /**
   * Best-effort: remove recipients from the configured campaign segment (e.g. after a broadcast).
   * Prefer calling after Resend has had time to resolve the segment (see delayed cleanup in the campaigns API route).
   */
  async removeRecipientsFromSegment(emails: string[]): Promise<void> {
    if (!this.resend) return;

    await Promise.allSettled(
      emails.map((email) =>
        this.resend!.contacts.segments.remove({
          email,
          segmentId: this.campaignSegmentId,
        }),
      ),
    );
  }

  /**
   * Dedupe addresses (case-insensitive) while preserving first-seen casing.
   */
  private dedupeRecipientEmails(emails: readonly string[]): string[] {
    const seen = new Set<string>();
    const out: string[] = [];
    for (const raw of emails) {
      const trimmed = raw.trim();
      if (!trimmed) continue;
      const key = trimmed.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(trimmed);
    }
    return out;
  }

  /**
   * Resend scratch-segment broadcast pipeline: dedupe → segment → footer → send → rollback on failure.
   * Add new broadcast types as public wrappers that render HTML and call this method.
   */
  private async sendMarketingSegmentBroadcast(
    params: SendMarketingSegmentBroadcastParams,
  ): Promise<MarketingSegmentBroadcastResult | null> {
    const {
      subject,
      emailHtml,
      recipientEmails,
      onEmptyRecipients,
      emptyRecipientsMessage = "No recipients found for the selected audiences",
    } = params;

    const unique = this.dedupeRecipientEmails(recipientEmails);
    if (unique.length === 0) {
      if (onEmptyRecipients === "throw") {
        throw new ApiError(emptyRecipientsMessage, 400, "Validation error");
      }
      return null;
    }

    if (!this.resend)
      throw new ApiError("Email service is not configured", 500);

    const html = appendUnsubscribeFooter(emailHtml);

    await this.ensureRecipientsInSegment(unique, this.campaignSegmentId);
    try {
      const { id } = await this.sendMarketingBroadcast({
        segmentId: this.campaignSegmentId,
        subject,
        html,
      });
      return { id, recipientEmails: unique };
    } catch (err) {
      await this.removeRecipientsFromSegment(unique);
      throw err;
    }
  }

  /**
   * Welcome broadcast to finalized exec team.
   * Returns null when there are no valid recipient addresses.
   */
  async sendNewExecWelcomeBroadcast(
    recipientEmails: string[],
    options: {
      when2MeetLink: string;
      termLabel: string;
      discordLink: string;
    },
  ): Promise<MarketingSegmentBroadcastResult | null> {
    const { when2MeetLink, termLabel, discordLink } = options;
    const emailHtml = await render(
      createElement(ExecWelcomeEmail, {
        termLabel,
        when2MeetLink,
        discordLink,
      }),
    );
    return this.sendMarketingSegmentBroadcast({
      subject: getExecWelcomeSubject(termLabel),
      emailHtml,
      recipientEmails,
      onEmptyRecipients: "skip",
    });
  }

  /**
   * Markdown body campaign (admin UI). Recipients are deduped before send.
   */
  async sendCampaignEmail(
    subject: string,
    body: string,
    recipientEmails: string[],
  ): Promise<MarketingSegmentBroadcastResult> {
    const emailHtml = await render(createElement(CampaignEmail, { subject, body }));
    const result = await this.sendMarketingSegmentBroadcast({
      subject,
      emailHtml,
      recipientEmails,
      onEmptyRecipients: "throw",
    });
    if (!result) {
      throw new ApiError(
        "No recipients found for the selected audiences",
        400,
        "Validation error",
      );
    }
    return result;
  }

  /**
   * Hiring: send an offer or rejection email to an applicant for a specific role.
   */
  async sendHiringDecisionEmail(
    recipientEmail: string,
    options: {
      type: "offer" | "rejection";
      applicantName: string;
      positionName: string;
      offerTermLabel?: string;
      offerAcceptByDateLabel?: string;
    },
  ): Promise<void> {
    const { type, applicantName, positionName, offerTermLabel, offerAcceptByDateLabel } =
      options;
    const subject = getHiringDecisionSubject(type);
    const html = await render(
      createElement(HiringDecisionEmail, {
        type,
        applicantName,
        positionName,
        offerTermLabel,
        offerAcceptByDateLabel,
      }),
    );

    await this.sendTransactionalEmail({ to: [recipientEmail], subject, html });
  }

  /**
   * Membership payment webhook: welcome or generic “try again / contact us” notice.
   */
  async sendMembershipReceiptNotice(
    recipientEmails: string[],
    options: { success: boolean },
  ): Promise<void> {
    if (recipientEmails.length === 0) return;

    const { success } = options;
    const subject = getMembershipReceiptSubject(success);
    const html = await render(createElement(MembershipReceipt, { success }));

    await this.sendTransactionalEmail({ to: recipientEmails, subject, html });
  }
}

export const emailService = new EmailService();
