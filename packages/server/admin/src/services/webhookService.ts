import { Resend, type GetReceivingEmailResponseSuccess } from "resend";

type GetReceivedEmailContentsResult =
  | { ok: true; email: GetReceivingEmailResponseSuccess }
  | {
      ok: false;
      reason: "missing_api_key" | "resend_error" | "wrong_recipient";
      message: string;
    };

class WebhookService {
  /** Inbound address for membership receipt processing (Resend receiving / MX). */
  private readonly membershipInboundEmail = "membership@contact.uwdatascience.ca";
  private readonly resend: Resend | null;

  constructor() {
    const key = process.env.RESEND_API_KEY;
    this.resend = key ? new Resend(key) : null;
  }

  private verifyRecipient(to: string[], recipient: string): boolean {
    const want = recipient.trim().toLowerCase();
    return to.some((raw) => {
      const t = raw.trim();
      const match = /<([^>]+)>/.exec(t);
      return (match?.[1]?.trim() ?? t).toLowerCase() === want;
    });
  }

  /**
   * Loads full inbound email content (html, text, headers, etc.) for an `email.received` webhook.
   * `receivingEmailId` is `data.email_id`; `webhookTo` is `data.to` from the verified payload.
   */
  async getReceivedEmail(
    receivingEmailId: string,
    webhookTo: string[],
  ): Promise<GetReceivedEmailContentsResult> {
    if (!this.verifyRecipient(webhookTo, this.membershipInboundEmail)) {
      return {
        ok: false,
        reason: "wrong_recipient",
        message: `Email is not addressed to ${this.membershipInboundEmail}`,
      };
    }

    if (!this.resend) {
      return {
        ok: false,
        reason: "missing_api_key",
        message: "RESEND_API_KEY is not configured",
      };
    }

    const { data, error } = await this.resend.emails.receiving.get(receivingEmailId);

    if (error || !data) {
      const message =
        typeof error === "object" &&
        error !== null &&
        "message" in error &&
        typeof (error as { message: unknown }).message === "string"
          ? (error as { message: string }).message
          : "Failed to fetch received email from Resend";
      return { ok: false, reason: "resend_error", message };
    }

    return { ok: true, email: data };
  }
}

export const webhookService = new WebhookService();
