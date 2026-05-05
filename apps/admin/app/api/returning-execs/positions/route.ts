import { ApiResponse } from "@uwdsc/common/utils";
import { returningExecRepository } from "@uwdsc/admin";
import { withAuth } from "@/guards/withAuth";

/**
 * GET /api/returning-execs/positions
 * Returns all available application positions for the returning exec form.
 */
export const GET = withAuth(async () => {
  try {
    const positions = await returningExecRepository.getAvailablePositions();
    return ApiResponse.ok(positions);
  } catch (error) {
    console.error("Error fetching available positions:", error);
    return ApiResponse.serverError(error, "Failed to fetch positions");
  }
});
