import { ApiError } from "@uwdsc/common/types";
import { ApiResponse } from "@uwdsc/common/utils";
import { hiringService } from "@uwdsc/admin";
import { withPresAccess } from "@/guards/withPresAccess";

/**
 * POST /api/applications/hiring/finalize
 * Finalize user roles for the new term based on accepted offers.
 */
export const POST = withPresAccess(async () => {
  try {
    const summary = await hiringService.finalizeRoles();
    return ApiResponse.ok({ summary });
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      return ApiResponse.json(
        { error: error.message, message: error.message },
        error.statusCode,
      );
    }
    console.error("Error finalizing roles:", error);
    return ApiResponse.serverError(error, "Failed to finalize roles");
  }
});
