import { NextRequest } from "next/server";
import { headers } from "next/headers";
import { ApiError } from "@uwdsc/common/types";
import { ApiResponse } from "@uwdsc/common/utils";
import { membershipService, webhookService } from "@uwdsc/admin";
import { applicationService } from "@uwdsc/core";
import { Webhook } from "svix";
import { WebhookEventPayload } from "resend";

/**
 * POST /api/webhooks
 * Resend inbound (`email.received`) webhook - verifies Svix signature, then loads email body via API.
 *
 * Always returns HTTP 200 so Resend does not retry (at-least-once delivery; non-2xx triggers backoff).
 * Use `success` in the JSON body to distinguish handled failures from processed receipts.
 */
export async function POST(request: NextRequest): Promise<Response> {
  const WEBHOOK_SECRET = process.env.RESEND_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error("[Webhook] Missing RESEND_WEBHOOK_SECRET");
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
      console.error("[Webhook] Error verifying webhook:", err);
      return ApiResponse.ok({ success: false, reason: "invalid_signature" });
    }

    if (evt.type !== "email.received") {
      return ApiResponse.ok({ success: false, reason: "invalid_event_type", event: evt.type });
    }

    const target = webhookService.resolveInboundTarget(evt.data.to);
    if (!target) return ApiResponse.ok({ success: false, reason: "wrong_recipient" });

    const contents = await webhookService.getReceivedEmail(evt.data.email_id);
    if (!contents.ok) {
      console.error("[Webhook]", contents.message);
      return ApiResponse.ok({
        success: false,
        reason: contents.reason,
        message: contents.message,
      });
    }

    switch (target) {
      case "membership": {
        const activeTerm = await applicationService.getActiveTerm();
        if (!activeTerm) throw new ApiError("No active term is configured", 400);
        await membershipService.processEmailReceipt(
          contents.email,
          activeTerm.start_date,
          evt.data.from,
        );
        break;
      }
      case "support": {
        // TODO: support@ inbound flow (to be implemented)
        console.log("[Webhook] Received support email", evt.data.email_id);
        break;
      }
      default: {
        const _exhaustive: never = target;
        return _exhaustive;
      }
    }

    return ApiResponse.ok({
      success: true,
      event: evt.type,
      emailId: evt.data.email_id,
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return ApiResponse.ok({
        success: false,
        reason: "processing_error",
        message: error.message,
        statusCode: error.statusCode,
      });
    }
    console.error("[Webhook] Failed to process request:", error);
    return ApiResponse.ok({
      success: false,
      reason: "unexpected_error",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
