import { NextRequest } from "next/server";
import { headers } from "next/headers";
import { ApiResponse } from "@uwdsc/common/utils";
import { webhookService } from "@uwdsc/admin";
import { Webhook } from "svix";
import type { WebhookEventPayload } from "resend";

/**
 * POST /api/webhooks/support
 * Resend inbound (`email.received`) webhook for support inbox. Verifies Svix signature,
 * loads the full email via Resend API, and forwards sender/subject/body to a Discord webhook.
 */
export async function POST(request: NextRequest): Promise<Response> {
  const WEBHOOK_SECRET = process.env.RESEND_WEBHOOK_SECRET;
  const DISCORD_WEBHOOK = process.env.SUPPORT_DISCORD_WEBHOOK_URL;
  const SUPPORT_INBOX = "support@mail.uwdatascience.ca";

  if (!WEBHOOK_SECRET) {
    console.error("[Support Webhook] Missing RESEND_WEBHOOK_SECRET");
    return ApiResponse.ok({ success: false, reason: "missing_webhook_secret" });
  }

  try {
    const headerPayload = await headers();
    const svix_id = headerPayload.get("svix-id");
    const svix_timestamp = headerPayload.get("svix-timestamp");
    const svix_signature = headerPayload.get("svix-signature");

    if (!svix_id || !svix_timestamp || !svix_signature) {
      return ApiResponse.ok({ success: false, reason: "missing_svix_headers" });
    }

    const payload = await request.json();
    const body = JSON.stringify(payload);

    const wh = new Webhook(WEBHOOK_SECRET);
    let evt: WebhookEventPayload;

    try {
      evt = wh.verify(body, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      }) as WebhookEventPayload;
    } catch (err) {
      console.error("[Support Webhook] Error verifying webhook:", err);
      return ApiResponse.ok({ success: false, reason: "invalid_signature" });
    }

    if (evt.type !== "email.received") {
      return ApiResponse.ok({
        success: false,
        reason: "invalid_event_type",
        event: evt.type,
      });
    }

    const contents = await webhookService.getReceivedEmailForRecipient(
      evt.data.email_id,
      evt.data.to,
      SUPPORT_INBOX,
    );
    if (!contents.ok) {
      console.error("[Support Webhook]", contents.message);
      return ApiResponse.ok({
        success: false,
        reason: contents.reason,
        message: contents.message,
      });
    }

    // Extract fields
    const received = contents.email;
    const subject = received.subject ?? "(no subject)";
    const textBody =
      received.text ?? (received.html ? "(html-only)" : "(no body)");
    const fromRaw =
      evt.data.from ??
      (Array.isArray(received.from) ? received.from.join(", ") : "");

    // Parse sender name/email
    let senderName = fromRaw;
    const m = /^(.*?)\s*<([^>]+)>/.exec(fromRaw);
    if (m && m[1]) senderName = m[1].trim();

    if (!DISCORD_WEBHOOK) {
      console.warn(
        "[Support Webhook] Missing SUPPORT_DISCORD_WEBHOOK_URL, skipping Discord notify",
      );
      return ApiResponse.ok({
        success: true,
        note: "no_discord_webhook_configured",
      });
    }

    // Prepare Discord embed (truncate to Discord limits)
    const truncate = (s: string, n = 4000) =>
      s.length > n ? s.slice(0, n - 3) + "..." : s;
    const embed = {
      title: truncate(subject, 256),
      author: { name: senderName },
      description: truncate(textBody, 4096),
      footer: { text: `To: ${SUPPORT_INBOX}` },
      timestamp: new Date().toISOString(),
    };

    try {
      await fetch(DISCORD_WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ embeds: [embed] }),
      });
    } catch (err) {
      console.error("[Support Webhook] Failed to post to Discord:", err);
      // don't fail the webhook (Resend expects 200)
    }

    return ApiResponse.ok({
      success: true,
      event: evt.type,
      emailId: evt.data.email_id,
    });
  } catch (error) {
    console.error("[Support Webhook] Failed to process request:", error);
    return ApiResponse.ok({
      success: false,
      reason: "unexpected_error",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
