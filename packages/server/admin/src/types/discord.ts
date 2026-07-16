export type ForwardSupportFailureReason = "missing_discord_webhook" | "forward_failed";

export type ForwardSupportResult =
  | { ok: true }
  | { ok: false; reason: ForwardSupportFailureReason };

export interface ForwardSupportToDiscordParams {
  subject: string;
  textBody: string;
  fromRaw: string;
}

export interface DiscordSupportEmbed {
  title: string;
  author: { name: string };
  description: string;
  footer: { text: string };
  timestamp: string;
}
