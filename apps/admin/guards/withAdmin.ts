import { RaftResponse } from "@uw-datasci/raft";
import type { RaftRouteHandler } from "@uwdsc/core/http";
import { isAdmin, readRoleClaims } from "@uwdsc/common/constants";
import { withAuth, type WithAuthContext, type WithAuthHandler } from "./withAuth";

/**
 * Wraps an API route handler to require the portal `admin` role (Supabase
 * `app_metadata.role`). Exec users are rejected even if they can access the
 * rest of the admin app. `pres` is a superset of `admin` and also passes.
 *
 * Inherits Raft error quarantine from {@link withAuth}.
 */
export function withAdmin<C extends WithAuthContext>(
  handler: WithAuthHandler<C>
): RaftRouteHandler<C> {
  return withAuth<C>(async (request, context, user) => {
    const claims = readRoleClaims(user.app_metadata);
    if (!isAdmin(claims.role)) return RaftResponse.forbidden("You must be admin to access");

    return handler(request, context, user);
  });
}
