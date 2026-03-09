import { NextRequest } from "next/server";
import { ApiResponse } from "@uwdsc/common/utils";

/**
 * POST /api/webhooks/gmail
 * Receives Gmail push notifications forwarded via Google Cloud Pub/Sub.
 * Google sends a JSON body with a base64-encoded Pub/Sub message.
 */
export async function POST(request: NextRequest): Promise<Response> {
  try {
    const body = await request.json();
    console.log(
      "[Gmail Webhook] Received Pub/Sub message:",
      JSON.stringify(body, null, 2),
    );
    return ApiResponse.ok({ received: true });
  } catch (error) {
    console.error("[Gmail Webhook] Failed to parse request body:", error);
    return ApiResponse.badRequest("Invalid request body");
  }
}
