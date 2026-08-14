import { ApiError } from "@uwdsc/common/types";
import { ApiResponse } from "@uwdsc/common/utils";
import { applicationService } from "@uwdsc/admin";
import type { WithAuthContext } from "@/guards/withAuth";
import { withPresAccess } from "@/guards/withPresAccess";

interface Params extends WithAuthContext {
  params: Promise<{ id: string }>;
}

/**
 * DELETE /api/applications/positions/[id]
 * Close a position for applications (soft-closes its
 * application_positions_available row -- the row, existing selections, and
 * its question assignments are kept; the role just stops appearing as an
 * option for new applicants). President only.
 */
export const DELETE = withPresAccess<Params>(async (_request, { params }) => {
  try {
    const { id } = await params;
    const availableId = Number(id);
    if (!Number.isInteger(availableId) || availableId <= 0) {
      return ApiResponse.badRequest("Invalid position identifier");
    }

    await applicationService.closeAvailablePosition(availableId);
    return ApiResponse.ok({ success: true });
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      return ApiResponse.json(
        { error: error.message, message: error.message },
        error.statusCode,
      );
    }
    console.error("Error closing position for applications:", error);
    return ApiResponse.serverError(error, "Failed to close position");
  }
});
