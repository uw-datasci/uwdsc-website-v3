import { ApiError } from "@uwdsc/common/types";
import { ApiResponse } from "@uwdsc/common/utils";
import { hiringService } from "@uwdsc/admin";
import { withPresAccess } from "@/guards/withPresAccess";

/**
 * GET /api/applications/hiring
 * Get all applicants with position selections for the hiring dashboard.
 */
export const GET = withPresAccess(async () => {
  try {
    const applicants = await hiringService.getHiringApplicants();
    return ApiResponse.ok({ applicants });
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      return ApiResponse.json(
        { error: error.message, message: error.message },
        error.statusCode,
      );
    }
    console.error("Error fetching hiring applicants:", error);
    return ApiResponse.serverError(error, "Failed to fetch hiring applicants");
  }
});
