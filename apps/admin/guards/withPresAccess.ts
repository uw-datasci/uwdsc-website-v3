import type { User } from "@supabase/supabase-js";
import { ApiResponse } from "@uwdsc/common/utils";
import type { QuestionScope } from "@uwdsc/common/types";
import { withVpAccess, type VpScope } from "./withVpAccess";
import { type WithAuthContext } from "./withAuth";

export type PresAccessHandler<C = WithAuthContext> = (
  request: Request,
  context: C,
  user: User,
  scope: QuestionScope,
) => Promise<Response> | Response;

/**
 * Wraps an API route handler to require the user to be a President
 * (based on `QuestionScope.isPresident`).
 *
 * Returns 401 if not signed in or if the user's President scope is false.
 */
export function withPresAccess<C extends WithAuthContext = WithAuthContext>(
  handler: PresAccessHandler<C>,
): (request: Request, context?: C) => Promise<Response> {
  return withVpAccess<C>(async (request, context, user, scope: VpScope) => {
    if (!scope.isPresident) {
      return ApiResponse.unauthorized("Only Presidents can access this");
    }

    return handler(request, context, user, scope);
  });
}
