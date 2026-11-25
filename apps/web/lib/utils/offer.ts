import { rateLimitService } from "@uwdsc/core";
import {
  OFFER_IP_LIMIT,
  OFFER_RATE_WINDOW_SECONDS,
  OFFER_TOKEN_LIMIT,
} from "@/constants/offer";
import { getClientIp } from "./request";

/**
 * Rate limit offer page views by IP, and responses by IP and token. Fails open: a limiter
 * error shouldn't stop a candidate from answering before the deadline.
 */
export async function allowOfferRequest(headers: Headers, token?: string): Promise<boolean> {
  try {
    const ip = getClientIp(headers);
    const checks: Promise<boolean>[] = [];
    if (ip) {
      checks.push(
        rateLimitService.allow("offer-ip", ip, OFFER_IP_LIMIT, OFFER_RATE_WINDOW_SECONDS)
      );
    }
    if (token) {
      checks.push(
        rateLimitService.allow(
          "offer-token",
          token,
          OFFER_TOKEN_LIMIT,
          OFFER_RATE_WINDOW_SECONDS
        )
      );
    }
    return (await Promise.all(checks)).every(Boolean);
  } catch (error) {
    console.error("[offer] Rate limit check failed:", error);
    return true;
  }
}
