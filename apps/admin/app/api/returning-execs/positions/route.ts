import { ApiResponse, isReturningExecWindowOpen } from "@uwdsc/common/utils";
import { returningExecService } from "@uwdsc/admin";
import { withAuth } from "@/guards/withAuth";

/**
 * GET /api/returning-execs/positions
 * Returns all available application positions for the returning exec form.
 */
export const GET = withAuth(async () => {
  try {
    const term = await returningExecService.getActiveTerm();
    if (!term || !isReturningExecWindowOpen(term)) {
      return ApiResponse.json(
        {
          error: "Returning exec form is not open",
          message:
            "The returning exec form is only available during the configured submission window.",
        },
        403,
      );
    }
    const positions = await returningExecService.getAvailablePositions();
    return ApiResponse.ok(positions);
  } catch (error) {
    console.error("Error fetching available positions:", error);
    return ApiResponse.serverError(error, "Failed to fetch positions");
  }
});
