import { ApiResponse } from "@uwdsc/common/utils";
import { membershipService } from "@uwdsc/core";
import { tryGetCurrentUser } from "@/lib/api/utils";

/**
 * GET /api/membership
 * Returns the current user's membership status.
 */
export async function GET() {
  try {
    const { user, isUnauthorized } = await tryGetCurrentUser();
    if (isUnauthorized || !user) return isUnauthorized;

    const status = await membershipService.getMembershipStatus(user.id);
    return ApiResponse.ok(status);
  } catch (error: unknown) {
    console.error("Error checking membership:", error);
    return ApiResponse.serverError(error, "Failed to check membership status");
  }
}
