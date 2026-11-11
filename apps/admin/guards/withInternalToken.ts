import { createHash, timingSafeEqual } from "node:crypto";
import { RaftResponse } from "@uw-datasci/raft";
import { withRaftRoute, type RaftRouteContext, type RaftRouteHandler } from "@uwdsc/core/http";

/**
 * Guard for `/api/internal/*`: server-to-server routes for nexus-bot, which isn't a logged-in
 * user, so there's no session check. Callers send `Authorization: Bearer $NEXUS_BOT_INTERNAL_TOKEN`
 * (the same value in Infisical `/website/admin` and in nexus-bot). Anything else gets a 401.
 *
 * `/api` paths skip the session proxy (proxy.ts), so this guard is the only check: every internal
 * route must be wrapped in it. Like `withAuth`, it also applies {@link withRaftRoute}.
 */

/** Shorter tokens are treated as unset: generate one with `openssl rand -base64 48`. */
const MIN_TOKEN_LENGTH = 32;

const digest = (value: string) => createHash("sha256").update(value, "utf8").digest();

/**
 * Constant-time check of an `Authorization` header against the expected token. Both sides are
 * hashed first, so the comparison takes the same time whatever the presented token's length.
 */
export function bearerTokenMatches(header: string | null, expected: string): boolean {
  const presented = /^Bearer\s+(\S+)\s*$/i.exec(header ?? "")?.[1] ?? "";
  return timingSafeEqual(digest(presented), digest(expected)) && presented.length > 0;
}

export function withInternalToken<C extends RaftRouteContext = RaftRouteContext>(
  handler: RaftRouteHandler<C>
): RaftRouteHandler<C> {
  return withRaftRoute<C>(async (request, context) => {
    const expected = process.env.NEXUS_BOT_INTERNAL_TOKEN ?? "";
    if (expected.length < MIN_TOKEN_LENGTH) {
      // Misconfigured: refuse everything rather than accept a guessable token.
      console.error("[internal-api] NEXUS_BOT_INTERNAL_TOKEN is missing or too short");
      return RaftResponse.json({ error: "Internal API is not configured" }, 503);
    }
    if (!bearerTokenMatches(request.headers.get("authorization"), expected)) {
      return RaftResponse.unauthorized("Invalid or missing internal token");
    }
    return handler(request, context);
  });
}
