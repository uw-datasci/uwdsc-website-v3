import { SUPPORT_INBOUND_EMAIL } from "@uwdsc/common/constants";
import type { GetReceivingEmailResponseSuccess } from "resend";
import type {
  DiscordSupportEmbed,
  ForwardSupportResult,
  ForwardSupportToDiscordParams,
} from "../../types/discord";

class DiscordService {
  private readonly webhookUrl: string | null;

  constructor() {
    this.webhookUrl = process.env.SUPPORT_DISCORD_WEBHOOK_URL ?? null;
  }

  private truncate(s: string, n = 4000): string {
    return s.length > n ? s.slice(0, n - 3) + "..." : s;
  }

  private parseSenderName(fromRaw: string): string {
    let senderName = fromRaw;
    const m = /^(.*?)\s*<([^>]+)>/.exec(fromRaw);
    if (m?.[1]) senderName = m[1].trim();
    return senderName;
  }

  private buildSupportEmbed(
    subject: string,
    textBody: string,
    senderName: string,
  ): DiscordSupportEmbed {
    return {
      title: this.truncate(subject, 256),
      author: { name: senderName },
      description: this.truncate(textBody, 4096),
      footer: { text: `To: ${SUPPORT_INBOUND_EMAIL}` },
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Post a support message to the Discord webhook.
   */
  async forwardSupportToDiscord(
    params: ForwardSupportToDiscordParams,
  ): Promise<ForwardSupportResult> {
    if (!this.webhookUrl) {
      return { ok: false, reason: "missing_discord_webhook" };
    }

    const embed = this.buildSupportEmbed(
      params.subject,
      params.textBody,
      this.parseSenderName(params.fromRaw),
    );

    try {
      await fetch(this.webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ embeds: [embed] }),
      });
      return { ok: true };
    } catch (err) {
      console.error("[DiscordService] Failed to post support email to Discord:", err);
      return { ok: false, reason: "forward_failed" };
    }
  }

  /**
   * Forward a support inbound email to the Discord webhook.
   * Does not throw if the webhook is missing or the post fails (best-effort notify).
   */
  async processSupportEmail(
    email: GetReceivingEmailResponseSuccess,
    forwarderFrom: string,
  ): Promise<void> {
    const subject = email.subject ?? "(no subject)";
    const textBody = email.text ?? (email.html ? "(html-only)" : "(no body)");
    const fromRaw =
      forwarderFrom ?? (Array.isArray(email.from) ? email.from.join(", ") : "");

    const result = await this.forwardSupportToDiscord({ subject, textBody, fromRaw });

    if (!result.ok && result.reason === "missing_discord_webhook") {
      console.warn(
        "[DiscordService] Missing SUPPORT_DISCORD_WEBHOOK_URL, skipping Discord notify",
      );
    }
  }
}

export const discordService = new DiscordService();
