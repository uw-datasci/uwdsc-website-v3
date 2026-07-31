import type { User } from "@supabase/supabase-js";
import { isPresident } from "@uwdsc/common/constants";
import type { QuestionScope } from "@uwdsc/common/types";
import { ApiResponse } from "@uwdsc/common/utils";
import { createAuthService } from "@/lib/services";
import { withAuth, type WithAuthContext } from "./withAuth";

export type PresAccessHandler<C = WithAuthContext> = (
  request: Request,
  context: C,
  user: User,
  scope: QuestionScope,
) => Promise<Response> | Response;

/**
 * Wraps an API route handler to require the `pres` user role.
 *
 * Returns 401 if not signed in or if the user's role is not president.
 */
export function withPresAccess<C extends WithAuthContext = WithAuthContext>(
  handler: PresAccessHandler<C>,
): (request: Request, context?: C) => Promise<Response> {
  return withAuth<C>(async (request, context, user) => {
    const role = user.app_metadata?.role as string | undefined;
    if (!isPresident(role)) {
      return ApiResponse.unauthorized("Only Presidents can access this");
    }

    const authService = await createAuthService();
    const scope = await authService.getScopeForUser(user.id, role);
    return handler(request, context, user, scope);
  });
}
