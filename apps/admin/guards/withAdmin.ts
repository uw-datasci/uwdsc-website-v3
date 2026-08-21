import type { User } from "@supabase/supabase-js";
import { RaftResponse } from "@uw-datasci/raft";
import type { RaftRouteHandler } from "@uwdsc/core/http";
import type { QuestionScope } from "@uwdsc/common/types";
import { isAdmin, readRoleClaims } from "@uwdsc/common/constants";
import { createAuthService } from "@/lib/services";
import { withAuth, type WithAuthContext, type WithAuthHandler } from "./withAuth";

export type WithAdminScopeHandler<C extends WithAuthContext = WithAuthContext> = (
  request: Request,
  context: C,
  user: User,
  scope: QuestionScope
) => Promise<Response> | Response;

export interface WithAdminOptions {
  scope?: boolean;
}

/**
 * Wraps an API route handler to require the portal `admin` role (Supabase
 * `app_metadata.role`). Exec users are rejected even if they can access the
 * rest of the admin app. `pres` is a superset of `admin` and also passes.
 *
 * Pass `{ scope: true }` when the handler needs subteam/president scoping
 * (e.g. application questions, returning execs).
 *
 * Inherits Raft error quarantine from {@link withAuth}.
 */
export function withAdmin<C extends WithAuthContext>(
  handler: WithAuthHandler<C>
): RaftRouteHandler<C>;

export function withAdmin<C extends WithAuthContext>(
  handler: WithAdminScopeHandler<C>,
  options: WithAdminOptions & { scope: true }
): RaftRouteHandler<C>;

export function withAdmin<C extends WithAuthContext>(
  handler: WithAuthHandler<C> | WithAdminScopeHandler<C>,
  options: WithAdminOptions = {}
): RaftRouteHandler<C> {
  return withAuth<C>(async (request, context, user) => {
    const claims = readRoleClaims(user.app_metadata);
    if (!isAdmin(claims.role)) return RaftResponse.forbidden("You must be admin to access");

    if (options.scope) {
      const authService = await createAuthService();
      const scope = await authService.getScopeForUser(claims);
      return (handler as WithAdminScopeHandler<C>)(request, context, user, scope);
    }

    return (handler as WithAuthHandler<C>)(request, context, user);
  });
}
