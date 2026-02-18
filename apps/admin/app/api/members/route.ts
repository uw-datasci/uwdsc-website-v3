import { ApiResponse } from "@uwdsc/common/utils";
import { profileService } from "@uwdsc/admin";
import { tryGetCurrentUser } from "@/lib/api/utils";

/**
 * GET /api/members
 * Get all user profiles with membership statistics
 * Admin only endpoint
 */
export async function GET(request: Request) {
  try {
    // Verify admin access
    const { isUnauthorized } = await tryGetCurrentUser();
    if (isUnauthorized) return isUnauthorized;

    // TODO: Add proper admin role check here
    // For now, any authenticated user can access
    // In production, you should verify the user has an admin role

    // Get query parameter to determine what data to return
    const { searchParams } = new URL(request.url);
    const statsOnly = searchParams.get("stats") === "true";

    if (statsOnly) {
      // Return only statistics
      const stats = await profileService.getMembershipStats();
      return ApiResponse.ok({ stats });
    }

    // Return all profiles
    const profiles = await profileService.getAllProfiles();
    return ApiResponse.ok(profiles);
  } catch (error: unknown) {
    console.error("Error fetching memberships:", error);
    return ApiResponse.serverError(error, "Failed to fetch membership data");
  }
}
