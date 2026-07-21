import { MEMBERSHIP_INBOUND_EMAIL, SUPPORT_INBOUND_EMAIL } from "@uwdsc/common/constants";
import { Resend } from "resend";
import type { GetReceivedEmailContentsResult } from "../../types/webhook";
import { extractEmailAddress } from "./emailAddress";

export type InboundEmailTarget = "membership" | "support";

class WebhookService {
  private readonly resend: Resend | null;
  private readonly membershipEmail: string;
  private readonly supportEmail: string;

  constructor() {
    const key = process.env.RESEND_API_KEY;
    this.resend = key ? new Resend(key) : null;
    this.membershipEmail = MEMBERSHIP_INBOUND_EMAIL;
    this.supportEmail = SUPPORT_INBOUND_EMAIL;
  }

  private verifyRecipient(to: string[], recipient: string): boolean {
    const want = recipient.trim().toLowerCase();
    return to.some((raw) => extractEmailAddress(raw).toLowerCase() === want);
  }

  resolveInboundTarget(to: string[]): InboundEmailTarget | null {
    if (this.verifyRecipient(to, this.membershipEmail)) return "membership";

    if (this.verifyRecipient(to, this.supportEmail)) return "support";

    return null;
  }

  /**
   * Loads full inbound email content (html, text, headers, etc.) for an `email.received` webhook.
   * `receivingEmailId` is `data.email_id` from the verified payload.
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

  /**
   * Same as `getReceivedEmail` but verifies against an arbitrary recipient address.
   */
  async getReceivedEmailForRecipient(
    receivingEmailId: string,
    webhookTo: string[],
    recipient: string,
  ): Promise<GetReceivedEmailContentsResult> {
    if (!this.verifyRecipient(webhookTo, recipient)) {
      return {
        ok: false,
        reason: "wrong_recipient",
        message: `Email is not addressed to ${recipient}`,
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
