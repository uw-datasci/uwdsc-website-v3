import { NextRequest } from "next/server";
import { ApiResponse } from "@uwdsc/common/utils";
import { webhookService } from "@uwdsc/admin";

const gmailClientId = process.env.GMAIL_CLIENT_ID;
const gmailClientSecret = process.env.GMAIL_CLIENT_SECRET;
const gmailRefreshToken = process.env.GMAIL_REFRESH_TOKEN;

/**
 * POST /api/webhooks/gmail
 * Receives Gmail push notifications forwarded via Google Cloud Pub/Sub.
 * Google sends a JSON body with a base64-encoded Pub/Sub message.
 */
export async function POST(request: NextRequest): Promise<Response> {
  try {
    if (!gmailClientId || !gmailClientSecret || !gmailRefreshToken) {
      return ApiResponse.badRequest("Missing Gmail credentials");
    }

    const body = await request.json();
    if (!body.message?.data) return ApiResponse.badRequest("No message data");

    const email = await webhookService.processGmailWebhook(body.message.data, {
      clientId: gmailClientId,
      clientSecret: gmailClientSecret,
      refreshToken: gmailRefreshToken,
    });

    console.log("Verified Gmail credentials");

    if (!email) return ApiResponse.ok({ received: false });

    console.log("Extracted Forwarded Email Content:", email.body);

    // TODO: execute final action with email data here

    return ApiResponse.ok({ received: true });
  } catch (error) {
    console.error("[Gmail Webhook] Failed to process request:", error);
    return ApiResponse.badRequest("Invalid request body");
  }
}
