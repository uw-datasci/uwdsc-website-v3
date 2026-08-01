import { ApiResponse, isReturningExecWindowOpen } from "@uwdsc/common/utils";
import { returningExecService } from "@uwdsc/admin";
import { withAuth } from "@/guards/withAuth";

/**
 * GET /api/returning-execs/positions
 * Returns every exec position (excluding Presidents and Advisors) for the
 * returning exec form. Not gated by the public application's position toggles.
 */
export const GET = withAuth(
  async () => {
    try {
      const term = await returningExecService.getActiveTerm();
      if (!term || !isReturningExecWindowOpen(term)) {
        return ApiResponse.forbidden(
          "The returning exec form is only available during the configured submission window.",
          "Returning exec form is not open",
        );
      }
      const positions = await returningExecService.getSelectablePositions();
      return ApiResponse.ok(positions);
    } catch (error) {
      console.error("Error fetching available positions:", error);
      return ApiResponse.serverError(error, "Failed to fetch positions");
    }
  },
  { allowAlum: true },
);
