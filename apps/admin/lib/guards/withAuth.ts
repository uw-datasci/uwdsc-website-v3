import type { User } from "@supabase/supabase-js";
import { ApiResponse } from "@uwdsc/common/utils";
import { createAuthService } from "@/lib/services";
import { ADMIN_ROLES } from "@/constants/roles";

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
 * Wraps an API route handler to require an authenticated user with admin or exec role.
 * Returns 401 if not signed in or if the user's role is not in ADMIN_ROLES.
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
 */
export function withAuth<C extends WithAuthContext = WithAuthContext>(
  handler: WithAuthHandler<C>,
): (
  request: Request,
  context?: C,
) => Promise<Response> {
  return async function wrapped(
    request: Request,
    context?: C,
  ): Promise<Response> {
    const authService = await createAuthService();
    const { user, error } = await authService.getCurrentUser();

    if (error || !user) {
      return ApiResponse.unauthorized("Authentication required");
    }

    const role = user.app_metadata?.role as string | undefined;
    if (!role || !ADMIN_ROLES.has(role)) {
      return ApiResponse.unauthorized("Admin or exec access required");
    }

    return handler(request, (context ?? {}) as C, user);
  };
}
