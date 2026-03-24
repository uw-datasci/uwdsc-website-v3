import type { User } from "@supabase/supabase-js";
import type { QuestionScope } from "@uwdsc/common/types";
import { ApiResponse } from "@uwdsc/common/utils";
import { createAuthService } from "@/lib/services";
import { withAuth, type WithAuthContext } from "./withAuth";

export type VpScope = QuestionScope;

export type WithVpAccessHandler<C = WithAuthContext> = (
  request: Request,
  context: C,
  user: User,
  scope: QuestionScope,
) => Promise<Response> | Response;

export function withVpAccess<C extends WithAuthContext = WithAuthContext>(
  handler: WithVpAccessHandler<C>,
): (request: Request, context?: C) => Promise<Response> {
  return withAuth<C>(async (request, context, user) => {
    const authService = await createAuthService();
    const scope = await authService.getQuestionScopeForUser(user.id);
    const hasVpAccess =
      scope.hasVpExecRole ||
      scope.isPresident ||
      scope.vpPositionIds.length > 0;

    if (!hasVpAccess) {
      return ApiResponse.unauthorized(
        "Only VPs can access the application questions dashboard",
      );
    }
    return handler(request, context, user, scope);
  });
}
