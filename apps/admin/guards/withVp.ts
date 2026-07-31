import type { User } from "@supabase/supabase-js";
import type { QuestionScope } from "@uwdsc/common/types";
import { isAdmin } from "@uwdsc/common/constants";
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

export function withVp<C extends WithAuthContext = WithAuthContext>(
  handler: WithVpAccessHandler<C>,
): (request: Request, context?: C) => Promise<Response> {
  return withAuth<C>(async (request, context, user) => {
    const role = user.app_metadata?.role as string | undefined;
    if (!isAdmin(role)) return ApiResponse.unauthorized("Only VPs can access this");

    const authService = await createAuthService();
    const scope = await authService.getScopeForUser(user.id, role);
    return handler(request, context, user, scope);
  });
}
