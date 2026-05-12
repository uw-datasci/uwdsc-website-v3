import { ApiResponse } from "@uwdsc/common/utils";
import { withAuth, type WithAuthContext, type WithAuthHandler } from "./withAuth";

/**
 * Wraps an API route handler to require the portal `admin` role (Supabase
 * `app_metadata.role`). Exec users are rejected even if they can access the
 * rest of the admin app.
 */
export function withAdmin<C extends WithAuthContext = WithAuthContext>(
  handler: WithAuthHandler<C>,
): (request: Request, context?: C) => Promise<Response> {
  return withAuth<C>(async (request, context, user) => {
    const role = user.app_metadata?.role as string | undefined;
    if (role !== "admin") {
      return ApiResponse.forbidden("Only admin users can access this resource.");
    }
    return handler(request, context, user);
  });
}
