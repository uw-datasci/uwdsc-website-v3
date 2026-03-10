/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";
import { ApiResponse } from "@uwdsc/common/utils";

/**
 * POST /api/webhooks/gmail
 * Receives Gmail push notifications forwarded via Google Cloud Pub/Sub.
 * Google sends a JSON body with a base64-encoded Pub/Sub message.
 */
export async function POST(request: NextRequest): Promise<Response> {
  try {
    // 1. Parse the incoming Google Pub/Sub payload
    const body = await request.json();
    if (!body.message?.data) return ApiResponse.badRequest("No message data");

    // Decode the base64 Pub/Sub data to get the emailAddress and historyId
    const encodedData = body.message.data;
    const decodedStr = Buffer.from(encodedData, "base64").toString("utf-8");
    const { emailAddress, historyId } = JSON.parse(decodedStr);

    // 2. Generate a fresh Access Token using your Refresh Token
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: process.env.GMAIL_CLIENT_ID!,
        client_secret: process.env.GMAIL_CLIENT_SECRET!,
        refresh_token: process.env.GMAIL_REFRESH_TOKEN!,
        grant_type: "refresh_token",
      }),
    });
    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // 3. Fetch History to find the exact Message ID that triggered this webhook
    const historyResponse = await fetch(
      `https://gmail.googleapis.com/gmail/v1/users/${emailAddress}/history?startHistoryId=${historyId}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      },
    );
    const historyData = await historyResponse.json();

    // Extract the latest message ID
    const messagesAdded =
      historyData.history?.flatMap((h: any) => h.messagesAdded || []) || [];
    if (messagesAdded.length === 0) return ApiResponse.ok({ received: false });

    const messageId = messagesAdded[0].message.id;

    // 4. Fetch the full email payload using the Message ID
    const messageResponse = await fetch(
      `https://gmail.googleapis.com/gmail/v1/users/${emailAddress}/messages/${messageId}?format=full`,
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );
    const messageData = await messageResponse.json();

    // 5. Parse the Email Body
    // Gmail returns email bodies in base64url format. Forwarded emails are often nested in multipart payloads.
    let emailBody = "";
    const parts = messageData.payload.parts || [messageData.payload];

    // Recursive helper to find the plain text part of the email
    const findTextPlain = (partsArray: any[]): string | null => {
      for (const part of partsArray) {
        if (part.mimeType === "text/plain" && part.body?.data) {
          // Note: Gmail uses base64url, so standard base64 decoding might fail without 'base64url' specified
          return Buffer.from(part.body.data, "base64url").toString("utf-8");
        }

        if (part.parts) {
          const found: string | null = findTextPlain(part.parts);
          if (found) return found;
        }
      }
      return null;
    };

    emailBody = findTextPlain(parts) || "No text content found";

    console.log("Extracted Forwarded Email Content:", emailBody);

    // 6. EXCECUTE YOUR FINAL HTTP REQUEST HERE

    // 7. Acknowledge receipt to Google so it stops retrying
    return ApiResponse.ok({ received: true });
  } catch (error) {
    console.error("[Gmail Webhook] Failed to parse request body:", error);
    return ApiResponse.badRequest("Invalid request body");
  }
}
