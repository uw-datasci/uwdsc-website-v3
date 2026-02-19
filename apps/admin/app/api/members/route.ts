import { ApiResponse } from "@uwdsc/common/utils";
import { profileService } from "@uwdsc/admin";
import { withAuth } from "@/lib/guards/withAuth";

/**
 * GET /api/members
 * Get all user profiles with membership statistics
 * Admin/exec only
 */
export const GET = withAuth(async (request) => {
  try {
    const { searchParams } = new URL(request.url);
    const statsOnly = searchParams.get("stats") === "true";

    if (statsOnly) {
      const stats = await profileService.getMembershipStats();
      return ApiResponse.ok({ stats });
    }

    const profiles = await profileService.getAllProfiles();
    return ApiResponse.ok(profiles);
  } catch (error: unknown) {
    console.error("Error fetching memberships:", error);
    return ApiResponse.serverError(error, "Failed to fetch membership data");
  }
});
