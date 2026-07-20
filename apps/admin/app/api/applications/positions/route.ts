import { ApiError } from "@uwdsc/common/types";
import { ApiResponse } from "@uwdsc/common/utils";
import { applicationService } from "@uwdsc/admin";
import { withPresAccess } from "@/guards/withPresAccess";
import { addPositionSchema } from "@/lib/schemas/positions";

/**
 * GET /api/applications/positions
 * List every exec position (excluding Presidents) with its current
 * application-availability. President only.
 */
export const GET = withPresAccess(async () => {
  try {
    const positions = await applicationService.getManagablePositions();
    return ApiResponse.ok({ positions });
  } catch (error: unknown) {
    console.error("Error fetching managable positions:", error);
    return ApiResponse.serverError(error, "Failed to fetch positions");
  }
});

/**
 * POST /api/applications/positions
 * Open an exec position for applications. President only.
 */
export const POST = withPresAccess(async (request) => {
  try {
    const body = await request.json();
    const parsed = addPositionSchema.safeParse(body);
    if (!parsed.success) {
      return ApiResponse.badRequest(
        parsed.error.issues[0]?.message ?? "Invalid position payload",
      );
    }

    const created = await applicationService.addAvailablePosition(
      parsed.data.positionId,
    );
    return ApiResponse.ok({ success: true, availableId: created.id });
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      return ApiResponse.json(
        { error: error.message, message: error.message },
        error.statusCode,
      );
    }
    console.error("Error opening position for applications:", error);
    return ApiResponse.serverError(error, "Failed to open position");
  }
});
