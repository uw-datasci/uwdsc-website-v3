import { ApiError, type ApplicationReviewStatus } from "@uwdsc/common/types";
import { ApiResponse } from "@uwdsc/common/utils";
import { hiringService } from "@uwdsc/admin";
import { withPresAccess } from "@/guards/withPresAccess";

interface ParamsContext {
  params: Promise<{ id: string }>;
}

/**
 * PATCH /api/applications/hiring/selections/[id]
 * Update a single position selection's review status (president-only statuses).
 */
export const PATCH = withPresAccess<ParamsContext>(
  async (request, { params }) => {
    try {
      const { id } = await params;
      const body = (await request.json()) as {
        status?: ApplicationReviewStatus;
      };

      if (!body.status) {
        return ApiResponse.badRequest("Status is required");
      }

      await hiringService.updateSelectionStatus(id, body.status);
      return ApiResponse.ok({ success: true });
    } catch (error: unknown) {
      if (error instanceof ApiError) {
        return ApiResponse.json(
          { error: error.message, message: error.message },
          error.statusCode,
        );
      }
      console.error("Error updating selection status:", error);
      return ApiResponse.serverError(
        error,
        "Failed to update selection status",
      );
    }
  },
);
