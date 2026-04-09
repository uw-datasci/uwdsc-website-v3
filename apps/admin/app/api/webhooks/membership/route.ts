import { NextRequest } from "next/server";
import { headers } from "next/headers";
import { ApiError } from "@uwdsc/common/types";
import { ApiResponse } from "@uwdsc/common/utils";
import { membershipService, webhookService } from "@uwdsc/admin";
import { applicationService } from "@uwdsc/core";
import { Webhook } from "svix";
import { WebhookEventPayload } from "resend";

/**
 * POST /api/webhooks/membership
 * Resend inbound (`email.received`) webhook — verifies Svix signature, then loads email body via API.
 */
export async function POST(request: NextRequest): Promise<Response> {
  const WEBHOOK_SECRET = process.env.RESEND_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    return ApiResponse.badRequest("Missing webhook secret");
  }

  try {
    const headerPayload = await headers();
    const svix_id = headerPayload.get("svix-id");
    const svix_timestamp = headerPayload.get("svix-timestamp");
    const svix_signature = headerPayload.get("svix-signature");

    if (!svix_id || !svix_timestamp || !svix_signature) {
      return ApiResponse.badRequest("Missing svix headers");
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
      console.error("[Membership Webhook] Error verifying webhook:", err);
      return ApiResponse.badRequest("Error verifying webhook");
    }

    if (evt.type !== "email.received") return ApiResponse.badRequest("Invalid webhook event");

    const contents = await webhookService.getReceivedEmail(evt.data.email_id);
    if (!contents.ok) {
      console.error("[Membership Webhook]", contents.message);
      return ApiResponse.serverError(
        contents.message,
        contents.reason === "missing_api_key"
          ? "Email fetch is not configured"
          : "Failed to load received email",
      );
    }

    const activeTerm = await applicationService.getActiveTerm();

    if (!activeTerm) throw new ApiError("No active term is configured", 400);

    await membershipService.processEmailReceipt(contents.email, activeTerm.start_date);

    return ApiResponse.ok({
      success: true,
      event: evt.type,
      emailId: evt.data.email_id,
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return ApiResponse.json(
        { error: "Request failed", message: error.message },
        error.statusCode,
      );
    }
    console.error("[Membership Webhook] Failed to process request:", error);
    return ApiResponse.badRequest("Invalid request body");
  }
}
