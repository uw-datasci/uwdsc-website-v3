import { ApiResponse } from "@uwdsc/common/utils";
import { applicationService } from "@uwdsc/admin";
import { withAuth } from "@/guards/withAuth";

/**
 * GET /api/applications
 * Get all submitted applications with full details
 * Admin/exec only
 */
export const GET = withAuth(async () => {
  try {
    const applications = await applicationService.getAllApplications();
    return ApiResponse.ok(applications);
  } catch (error: unknown) {
    console.error("Error fetching applications:", error);
    return ApiResponse.serverError(error, "Failed to fetch applications");
  }
});
