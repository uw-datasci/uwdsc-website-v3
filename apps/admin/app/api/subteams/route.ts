import { ApiResponse } from "@uwdsc/common/utils";
import { teamService } from "@uwdsc/core";
import { withAuth } from "@/guards/withAuth";

/**
 * GET /api/subteams
 * List every subteam (`{ id, name }`), for pickers such as the President's
 * member role/subteam editor. Admin/exec only.
 */
export const GET = withAuth(async () => {
  try {
    const subteams = await teamService.getSubteams();
    return ApiResponse.ok(subteams);
  } catch (error: unknown) {
    console.error("Error fetching subteams:", error);
    return ApiResponse.serverError(error, "Failed to fetch subteams");
  }
});
