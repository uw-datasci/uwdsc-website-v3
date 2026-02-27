import { ApiResponse } from "@uwdsc/common/utils";
import { profileService } from "@uwdsc/admin";
import { withAuth } from "@/guards/withAuth";

/**
 * GET /api/members
 * Get all user profiles with membership statistics
 * Admin/exec only
 */
export const GET = withAuth(async (request) => {
  try {
    const { searchParams } = new URL(request.url);
    const statsOnly = searchParams.get("stats") === "true";
    const paidOnly = searchParams.get("paid") === "true";
    const searchQuery = searchParams.get("search") || undefined;

    if (statsOnly) {
      const stats = await profileService.getMembershipStats();
      return ApiResponse.ok({ stats });
    }

    const profiles = await profileService.getAllProfiles({
      paidOnly,
      searchQuery,
    });
    return ApiResponse.ok(profiles);
  } catch (error: unknown) {
    console.error("Error fetching memberships:", error);
    return ApiResponse.serverError(error, "Failed to fetch membership data");
  }
});
