import { RaftResponse } from "@uw-datasci/raft";
import type { RaftRouteHandler } from "@uwdsc/core/http";
import { isPres, readRoleClaims } from "@uwdsc/common/constants";
import { withAuth, type WithAuthContext, type WithAuthHandler } from "./withAuth";

/**
 * Wraps an API route handler to require the `pres` user role.
 *
 * Returns 401 if not signed in or if the user's role is not president.
 * Inherits Raft error quarantine from {@link withAuth}.
 */
export function withPresAccess<C extends WithAuthContext = WithAuthContext>(
  handler: WithAuthHandler<C>
): RaftRouteHandler<C> {
  return withAuth<C>(async (request, context, user) => {
    const claims = readRoleClaims(user.app_metadata);
    if (!isPres(claims.role)) return RaftResponse.unauthorized("You must be pres to access");

    return handler(request, context, user);
  });
}
