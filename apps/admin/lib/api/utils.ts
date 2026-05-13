import { createAuthService } from "@/lib/services";
import { ApiResponse } from "@uwdsc/common/utils";
import type { AuthResult } from "@/types/route-utils";

/**
 * Gets the current authenticated user or returns an unauthorized response.
 * Use this in API routes to simplify authentication checks.
 *
 * @example
 * ```ts
 * const { user, isUnauthorized } = await tryGetCurrentUser();
 * if (isUnauthorized) return isUnauthorized;
 * // Use user here - it's guaranteed to be non-null
 * ```
 */
export async function tryGetCurrentUser(): Promise<AuthResult> {
  const authService = await createAuthService();
  const { user, error: userError } = await authService.getCurrentUser();

  if (userError || !user) {
    return {
      user: null,
      isUnauthorized: ApiResponse.unauthorized("Authentication required"),
    };
  }

  return {
    user,
    isUnauthorized: null,
  };
}
