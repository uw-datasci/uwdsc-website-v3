import { Resend, type GetReceivingEmailResponseSuccess } from "resend";

type GetReceivedEmailContentsResult =
  | { ok: true; email: GetReceivingEmailResponseSuccess }
  | {
      ok: false;
      reason: "missing_api_key" | "resend_error";
      message: string;
    };

class WebhookService {
  private readonly resend: Resend | null;

  constructor() {
    const key = process.env.RESEND_API_KEY;
    this.resend = key ? new Resend(key) : null;
  }

  /**
   * Loads full inbound email content (html, text, headers, etc.) for an `email.received` webhook.
   * `receivingEmailId` is `data.email_id` from the verified Resend webhook payload.
   */
  async getReceivedEmail(receivingEmailId: string): Promise<GetReceivedEmailContentsResult> {
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
