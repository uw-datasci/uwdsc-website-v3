import type { User } from "@supabase/supabase-js";
import type { QuestionScope } from "@uwdsc/common/types";
import { isAdmin, readRoleClaims } from "@uwdsc/common/constants";
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
    const claims = readRoleClaims(user.app_metadata);
    if (!isAdmin(claims.role)) {
      return ApiResponse.unauthorized(
        "Only users with the admin or president role can access this",
      );
    }

    const authService = await createAuthService();
    const scope = await authService.getScopeForUser(claims);
    return handler(request, context, user, scope);
  });
}
