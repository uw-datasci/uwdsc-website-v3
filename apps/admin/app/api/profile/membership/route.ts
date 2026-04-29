import { ApiResponse } from "@uwdsc/common/utils";
import { membershipService } from "@uwdsc/core";
import { tryGetCurrentUser } from "@/lib/api/utils";

export async function GET(): Promise<Response> {
  try {
    const { user, isUnauthorized } = await tryGetCurrentUser();
    if (isUnauthorized) return isUnauthorized;
    if (!user) return ApiResponse.unauthorized("Authentication required");

    const status = await membershipService.getMembershipStatus(user.id);
    return ApiResponse.ok(status);
  } catch (error: unknown) {
    console.error("Error fetching membership status:", error);
    return ApiResponse.serverError(error, "Failed to fetch membership status");
  }
}
