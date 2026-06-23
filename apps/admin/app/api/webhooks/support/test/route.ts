import { NextRequest } from "next/server";
import { ApiResponse } from "@uwdsc/common/utils";

/**
 * POST /api/webhooks/support/test
 * Local-only test endpoint to verify Discord webhook formatting.
 */
export async function POST(request: NextRequest): Promise<Response> {
  const DISCORD_WEBHOOK = process.env.SUPPORT_DISCORD_WEBHOOK_URL;

  if (!DISCORD_WEBHOOK) {
    console.error("[Support Test] Missing SUPPORT_DISCORD_WEBHOOK_URL");
    return ApiResponse.ok({
      success: false,
      reason: "missing_discord_webhook",
    });
  }

  try {
    const payload = await request.json();
    const subject = payload.subject ?? "(no subject)";
    const textBody = payload.text ?? "(no body)";
    const from = payload.from ?? "(unknown sender)";

    const truncate = (s: string, n = 4000) =>
      s.length > n ? s.slice(0, n - 3) + "..." : s;

    const embed = {
      title: truncate(subject, 256),
      author: { name: from },
      description: truncate(textBody, 4096),
      footer: { text: "To: support@mail.uwdatascience.ca" },
      timestamp: new Date().toISOString(),
    };

    await fetch(DISCORD_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ embeds: [embed] }),
    });

    return ApiResponse.ok({ success: true });
  } catch (err) {
    console.error("[Support Test] Failed to forward to Discord:", err);
    return ApiResponse.ok({ success: false, reason: "forward_failed" });
  }
}
