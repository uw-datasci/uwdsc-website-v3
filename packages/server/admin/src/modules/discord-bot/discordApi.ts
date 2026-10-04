import { createPublicKey, verify, type KeyObject } from "node:crypto";
import { ApiError } from "@uwdsc/common/types";
import type { DiscordMessage, DiscordMessagePayload } from "../../types/discord";

const DISCORD_API = "https://discord.com/api/v10";
const REQUEST_TIMEOUT_MS = 10_000;
/** Reject signed requests whose timestamp is further than this from now (replay protection). */
const MAX_TIMESTAMP_SKEW_S = 5 * 60;

export function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new ApiError(`Missing ${name}`, 500);
  return value;
}

// ─── Request verification ────────────────────────────────────────────────────

let cachedKey: { hex: string; key: KeyObject } | null = null;

/** Discord gives the Ed25519 public key as 64 hex chars; Node wants it as a JWK (or SPKI). */
function getPublicKey(): KeyObject {
  const hex = requireEnv("DISCORD_PUBLIC_KEY");
  if (cachedKey?.hex === hex) return cachedKey.key;

  const key = createPublicKey({
    format: "jwk",
    key: { kty: "OKP", crv: "Ed25519", x: Buffer.from(hex, "hex").toString("base64url") },
  });
  cachedKey = { hex, key };
  return key;
}

/**
 * Verify Discord's Ed25519 signature over `timestamp + rawBody`. Must run against the exact raw
 * body bytes, before any JSON parsing. Discord probes the endpoint with bad signatures and
 * expects a 401 for them.
 */
export function verifyDiscordSignature(
  rawBody: string,
  signatureHex: string | null,
  timestamp: string | null
): boolean {
  const key = getPublicKey();
  if (!signatureHex || !timestamp) return false;
  if (!/^[0-9a-f]{128}$/i.test(signatureHex) || !/^\d+$/.test(timestamp)) return false;
  if (Math.abs(Date.now() / 1000 - Number(timestamp)) > MAX_TIMESTAMP_SKEW_S) return false;

  return verify(
    null,
    Buffer.from(timestamp + rawBody, "utf8"),
    key,
    Buffer.from(signatureHex, "hex")
  );
}

// ─── REST ────────────────────────────────────────────────────────────────────

export class DiscordApiError extends Error {
  constructor(
    message: string,
    readonly status: number
  ) {
    super(message);
    this.name = "DiscordApiError";
  }
}

async function discordFetch<T>(
  path: string,
  init: { method?: string; body?: unknown; auth?: boolean } = {}
): Promise<T> {
  const headers: Record<string, string> = {
    "User-Agent": "DiscordBot (https://uwdatascience.ca, 1.0)",
  };
  if (init.auth !== false) headers.Authorization = `Bot ${requireEnv("DISCORD_BOT_TOKEN")}`;
  if (init.body !== undefined) headers["Content-Type"] = "application/json";

  const response = await fetch(`${DISCORD_API}${path}`, {
    method: init.method ?? "GET",
    headers,
    body: init.body === undefined ? undefined : JSON.stringify(init.body),
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new DiscordApiError(
      `Discord ${init.method ?? "GET"} ${path.split("?")[0]} failed: ${response.status} ${text.slice(0, 500)}`,
      response.status
    );
  }

  return (await response.json()) as T;
}

/** Latest `limit` (max 100) messages in a channel/thread, newest first. */
export function getChannelMessages(channelId: string, limit = 100): Promise<DiscordMessage[]> {
  return discordFetch<DiscordMessage[]>(`/channels/${channelId}/messages?limit=${limit}`);
}

/** A single message, or null if it doesn't exist (or isn't visible to the bot). */
export async function getChannelMessage(
  channelId: string,
  messageId: string
): Promise<DiscordMessage | null> {
  try {
    return await discordFetch<DiscordMessage>(`/channels/${channelId}/messages/${messageId}`);
  } catch (error) {
    if (error instanceof DiscordApiError && (error.status === 404 || error.status === 403)) {
      return null;
    }
    throw error;
  }
}

/**
 * Edit the original interaction response. Authenticated by the interaction token, so it only
 * works for 15 minutes after the interaction. Returns the edited message (for its id).
 */
export function editOriginalResponse(
  interactionToken: string,
  body: DiscordMessagePayload
): Promise<DiscordMessage> {
  const appId = requireEnv("DISCORD_APPLICATION_ID");
  return discordFetch<DiscordMessage>(
    `/webhooks/${appId}/${interactionToken}/messages/@original`,
    { method: "PATCH", body, auth: false }
  );
}

/** Edit one of the bot's messages with the bot token - works after interaction tokens expire. */
export function editChannelMessage(
  channelId: string,
  messageId: string,
  body: DiscordMessagePayload
): Promise<DiscordMessage> {
  return discordFetch<DiscordMessage>(`/channels/${channelId}/messages/${messageId}`, {
    method: "PATCH",
    body,
  });
}
