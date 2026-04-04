import { render } from "@react-email/render";
import { createElement } from "react";
import { Resend } from "resend";
import { ApiError } from "@uwdsc/common/types";
import { CampaignEmailTemplate } from "../email-templates/campaign";
import { appendMarketingUnsubscribeFooter } from "../utils/marketingEmail";

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
      "UW Data Science Club <noreply@contact.uwdatascience.ca>";

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
   * Create and send a Resend Broadcast (marketing) to the configured segment.
   */
  private async sendMarketingBroadcast(params: {
    segmentId: string;
    subject: string;
    html: string;
  }): Promise<{ id?: string }> {
    if (!this.resend) throw new ApiError("Email service is not configured", 500);

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
      const message = this.resendErrorMessage(error) ?? "Failed to send campaign broadcast";
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
  private async ensureRecipientsInSegment(emails: string[], segmentId: string): Promise<void> {
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

  /** Sends a marketing broadcast via Resend; returns `recipientEmails`
   * for delayed {@link removeRecipientsFromSegment}.
   */
  async sendCampaignEmail(
    subject: string,
    body: string,
    recipientEmails: string[],
  ): Promise<{ id?: string; recipientEmails: string[] }> {
    if (recipientEmails.length === 0) {
      throw new ApiError(
        "No recipients found for the selected audiences",
        400,
        "Validation error",
      );
    }

    if (!this.resend) throw new ApiError("Email service is not configured", 500);

    const baseHtml = await render(
      createElement(CampaignEmailTemplate, {
        subject,
        body,
      }),
    );
    const html = appendMarketingUnsubscribeFooter(baseHtml);

    await this.ensureRecipientsInSegment(recipientEmails, this.campaignSegmentId);
    try {
      const { id } = await this.sendMarketingBroadcast({
        segmentId: this.campaignSegmentId,
        subject,
        html,
      });
      return { id, recipientEmails };
    } catch (err) {
      await this.removeRecipientsFromSegment(recipientEmails);
      throw err;
    }
  }
}

export const emailService = new EmailService();
