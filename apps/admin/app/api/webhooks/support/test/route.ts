import { NextRequest } from "next/server";
import { ApiResponse } from "@uwdsc/common/utils";
import { discordService } from "@uwdsc/admin";

/**
 * POST /api/webhooks/support/test
 * Local-only test endpoint to verify Discord webhook formatting.
 */
export async function POST(request: NextRequest): Promise<Response> {
  try {
    const payload = await request.json();
    const result = await discordService.forwardSupportToDiscord({
      subject: payload.subject ?? "(no subject)",
      textBody: payload.text ?? "(no body)",
      fromRaw: payload.from ?? "(unknown sender)",
    });

    if (!result.ok) {
      if (result.reason === "missing_discord_webhook") {
        console.error("[Support Test] Missing SUPPORT_DISCORD_WEBHOOK_URL");
      }
      return ApiResponse.ok({ success: false, reason: result.reason });
    }

    return ApiResponse.ok({ success: true });
  } catch (err) {
    console.error("[Support Test] Failed to forward to Discord:", err);
    return ApiResponse.ok({ success: false, reason: "forward_failed" });
  }
}
