import { ApiResponse } from "@uwdsc/common/utils";
import { isAdmin } from "@uwdsc/common/constants";
import { withAuth, type WithAuthContext, type WithAuthHandler } from "./withAuth";

/**
 * Wraps an API route handler to require the portal `admin` role (Supabase
 * `app_metadata.role`). Exec users are rejected even if they can access the
 * rest of the admin app. `pres` is a superset of `admin` and also passes.
 */
export function withAdmin<C extends WithAuthContext = WithAuthContext>(
  handler: WithAuthHandler<C>,
): (request: Request, context?: C) => Promise<Response> {
  return withAuth<C>(async (request, context, user) => {
    const role = user.app_metadata?.role as string | undefined;
    if (!isAdmin(role)) {
      return ApiResponse.forbidden("Only admin users can access this resource.");
    }
    return handler(request, context, user);
  });
}
