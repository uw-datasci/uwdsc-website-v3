import { createHash } from "node:crypto";
import { eventService } from "@uwdsc/core";
import { getClientIp } from "./request";

/**
 * Hash an IP address with a secret salt so we never store raw IPs (PII).
 * Returns null when the salt env var is missing to avoid meaningless hashes.
 */
function hashIp(ip: string): string | null {
  const salt = process.env.FEED_HASH_SALT;
  if (!salt) return null;
  return createHash("sha256")
    .update(salt + ip)
    .digest("hex");
}

/**
 * Fire-and-forget: record (or refresh) a feed subscriber in the DB.
 * Any error is swallowed and logged so it never affects the feed response.
 */
export async function recordFeedSubscriber(request: Request): Promise<void> {
  try {
    const ip = getClientIp(request.headers);
    if (!ip) return;

    const ipHash = hashIp(ip);
    if (!ipHash) return; // salt not configured — skip silently

    const userAgent = request.headers.get("user-agent");
    await eventService.recordFeedSubscriber(ipHash, userAgent);
  } catch (error) {
    console.error("Failed to record feed subscriber (non-fatal):", error);
  }
}
