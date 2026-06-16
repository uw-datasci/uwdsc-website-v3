import { ApiResponse } from "@uwdsc/common/utils";
import { applicationService } from "@uwdsc/core";
import { withAuth } from "@/guards/withAuth";

/**
 * GET /api/terms
 * Get all retained terms (ordered newest first).
 * Admin/exec only.
 */
export const GET = withAuth(async () => {
  try {
    const terms = await applicationService.getAllTerms();
    return ApiResponse.ok(terms);
  } catch (error: unknown) {
    console.error("Error fetching terms:", error);
    return ApiResponse.serverError(error, "Failed to fetch terms");
  }
});
