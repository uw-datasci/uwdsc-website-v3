import type { User } from "@supabase/supabase-js";
import { RaftResponse } from "@uw-datasci/raft";
import type { RaftRouteHandler } from "@uwdsc/core/http";
import { isPres, readRoleClaims } from "@uwdsc/common/constants";
import type { QuestionScope } from "@uwdsc/common/types";
import { createAuthService } from "@/lib/services";
import { withAuth, type WithAuthContext } from "./withAuth";

export type PresAccessHandler<C extends WithAuthContext = WithAuthContext> = (
  request: Request,
  context: C,
  user: User,
  scope: QuestionScope
) => Promise<Response> | Response;

/**
 * Wraps an API route handler to require the `pres` user role.
 *
 * Returns 401 if not signed in or if the user's role is not president.
 * Inherits Raft error quarantine from {@link withAuth}.
 */
export function withPresAccess<C extends WithAuthContext = WithAuthContext>(
  handler: PresAccessHandler<C>
): RaftRouteHandler<C> {
  return withAuth<C>(async (request, context, user) => {
    const claims = readRoleClaims(user.app_metadata);
    if (!isPres(claims.role)) return RaftResponse.unauthorized("You must be pres to access");

    const authService = await createAuthService();
    const scope = await authService.getScopeForUser(claims);
    return handler(request, context, user, scope);
  });
}
