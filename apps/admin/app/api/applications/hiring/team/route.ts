import { ApiError } from "@uwdsc/common/types";
import { ApiResponse } from "@uwdsc/common/utils";
import { hiringService } from "@uwdsc/admin";
import { withPresAccess } from "@/guards/withPresAccess";

/**
 * GET /api/applications/hiring/team
 * Get the new exec team derived from Accepted Offer selections.
 */
export const GET = withPresAccess(async () => {
  try {
    const team = await hiringService.getNewExecTeam();
    return ApiResponse.ok({ team });
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      return ApiResponse.json(
        { error: error.message, message: error.message },
        error.statusCode,
      );
    }
    console.error("Error fetching new exec team:", error);
    return ApiResponse.serverError(error, "Failed to fetch new exec team");
  }
});
