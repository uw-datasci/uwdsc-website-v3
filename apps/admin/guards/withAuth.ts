import type { User } from "@supabase/supabase-js";
import { ApiResponse } from "@uwdsc/common/utils";
import { membershipService } from "@uwdsc/core";
import { graceDuringOnboarding } from "@/lib/graceDuringOnboarding";
import { createAuthService } from "@/lib/services";
import { ADMIN_ROLES, ALUM_ROLE } from "@uwdsc/common/constants";

/**
 * Context shape passed to route handlers (e.g. { params: Promise<{ id: string }> }).
 * Use a more specific type when wrapping handlers with params.
 */
export type WithAuthContext = { params?: Promise<Record<string, string>> };

/**
 * Handler that receives the request, optional route context, and the authenticated admin/exec user.
 */
export type WithAuthHandler<C = WithAuthContext> = (
  request: Request,
  context: C,
  user: User,
) => Promise<Response> | Response;

/**
 * Options for {@link withAuth}.
 */
export interface WithAuthOptions {
  /**
   * Also allow users with the `alum` role through. Alum has no general admin-app access
   * (see `apps/admin/proxy.ts` and the `(admin)` layout) — only opt in on the handful of
   * self-service routes behind the returning-exec form (e.g. `/api/returning-execs/me`).
   */
  allowAlum?: boolean;
}

/**
 * Wraps an API route handler to require an authenticated user with admin or exec role.
 * Exec users must also have a paid membership record, except while the active term's
 * exec onboarding window is open (same rule as the admin pages layout).
 * Returns 401 if not signed in or if the user's role is not in ADMIN_ROLES (or `alum`,
 * when `options.allowAlum` is set).
 *
 * @example
 * // Route without params
 * export const GET = withAuth(async (_request, _context, _user) => {
 *   return ApiResponse.ok(await profileService.getAllProfiles());
 * });
 *
 * @example
 * // Route with params
 * interface Params { params: Promise<{ id: string }>; }
 * export const PATCH = withAuth<Params>(async (request, { params }, _user) => {
 *   const { id } = await params;
 *   // ...
 * });
 *
 * @example
 * // Route also reachable by alum users
 * export const GET = withAuth(async (_request, _context, user) => { ... }, { allowAlum: true });
 */
export function withAuth<C extends WithAuthContext = WithAuthContext>(
  handler: WithAuthHandler<C>,
  options: WithAuthOptions = {},
): (request: Request, context?: C) => Promise<Response> {
  return async function wrapped(request: Request, context?: C): Promise<Response> {
    const authService = await createAuthService();
    const { user, error } = await authService.getCurrentUser();

    if (error || !user) return ApiResponse.unauthorized("Authentication required");

    const role = user.app_metadata?.role as string | undefined;
    const isAllowedAlum = options.allowAlum && role === ALUM_ROLE;
    if (!role || (!ADMIN_ROLES.has(role) && !isAllowedAlum)) {
      return ApiResponse.unauthorized("Admin or exec access required");
    }

    if (role === "exec") {
      const membershipStatus = await membershipService.getMembershipStatus(user.id);

      if (!membershipStatus.has_membership) {
        const grace = await graceDuringOnboarding();

        if (!grace) {
          return ApiResponse.forbidden(
            "Exec accounts must have a paid membership before accessing admin APIs.",
            "Exec access requires a paid membership",
          );
        }
      }
    }

    return handler(request, (context ?? {}) as C, user);
  };
}
