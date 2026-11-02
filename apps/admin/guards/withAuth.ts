import type { User } from "@supabase/supabase-js";
import { RaftResponse } from "@uw-datasci/raft";
import { withRaftRoute, type RaftRouteContext, type RaftRouteHandler } from "@uwdsc/core/http";
import { membershipService } from "@uwdsc/core";
import { graceDuringOnboarding } from "@/lib/graceDuringOnboarding";
import { createAuthService } from "@/lib/services";
import { ADMIN_ROLES, readRoleClaims } from "@uwdsc/common/constants";

/**
 * Context shape passed to route handlers (e.g. { params: Promise<{ id: string }> }).
 * Use a more specific type when wrapping handlers with params.
 *
 * The params **payload** must be an inline object literal or a `type` alias -
 * never a named `interface`. Only anonymous object types receive TypeScript's
 * implicit index signature, which is what satisfies the underlying
 * `Record<string, string | string[]>` constraint.
 *
 * @example
 * interface Params extends WithAuthContext { params: Promise<{ id: string }> }  // works
 * interface RouteParams { id: string }                                          // TS2430
 */
export type WithAuthContext = RaftRouteContext;

/**
 * Handler that receives the request, route context, and the authenticated admin/exec user.
 */
export type WithAuthHandler<C extends WithAuthContext = WithAuthContext> = (
  request: Request,
  context: C,
  user: User
) => Promise<Response> | Response;

/**
 * Wraps an API route handler to require an authenticated user with admin or exec role.
 * Exec users must also have a paid membership record, except while the active term's
 * exec onboarding window is open (same rule as the admin pages layout).
 * Returns 401 if not signed in or if the user's role is not in ADMIN_ROLES.
 *
 * Also hardens the route with the Raft SDK via {@link withRaftRoute}: unhandled errors are
 * quarantined to Postgres and returned as a clean 500, and thrown `ApiError`s keep their
 * status code. Handlers wrapped by this guard — or by `withAdmin` / `withPresAccess`,
 * which all delegate here — need no try/catch of their own.
 *
 * @example
 * // Route without params
 * export const GET = withAuth(async (_request, _context, _user) => {
 *   return RaftResponse.ok(await profileService.getAllProfiles());
 * });
 *
 * @example
 * // Route with params
 * interface Params extends WithAuthContext { params: Promise<{ id: string }>; }
 * export const PATCH = withAuth<Params>(async (request, { params }, _user) => {
 *   const { id } = await params;
 *   // ...
 * });
 */
export function withAuth<C extends WithAuthContext = WithAuthContext>(
  handler: WithAuthHandler<C>
): RaftRouteHandler<C> {
  return withRaftRoute<C>(async function wrapped(request, context) {
    const authService = await createAuthService();
    const { user, error } = await authService.getCurrentUser();

    if (error || !user) return RaftResponse.unauthorized("Authentication required");

    const { role } = readRoleClaims(user.app_metadata);
    if (!role || !ADMIN_ROLES.has(role)) {
      return RaftResponse.unauthorized("Admin or exec access required");
    }

    if (role === "exec") {
      const [membershipStatus, grace] = await Promise.all([
        membershipService.getMembershipStatus(user.id),
        graceDuringOnboarding(),
      ]);

      if (!membershipStatus.has_membership && !grace) {
        return RaftResponse.forbidden(
          "You have not paid your membership this term",
          "Membership required"
        );
      }
    }

    return handler(request, context, user);
  });
}
