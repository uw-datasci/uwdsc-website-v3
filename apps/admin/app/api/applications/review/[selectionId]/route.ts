import { type ApplicationReviewStatus } from "@uwdsc/common/types";
import { ApiResponse } from "@uwdsc/common/utils";
import { applicationService } from "@uwdsc/admin";
import { withVpAccess } from "@/guards/withVpAccess";

interface ParamsContext {
  params: Promise<{ selectionId: string }>;
}

/**
 * PATCH /api/applications/review/[selectionId]
 * Update review status for a single position selection (VP subteam or President).
 */
export const PATCH = withVpAccess<ParamsContext>(
  async (request, { params }, user, scope) => {
    if (user.app_metadata?.role !== "admin") {
      return ApiResponse.unauthorized(
        "Only users with the admin role can update position review status",
      );
    }

    try {
      const { selectionId } = await params;
      const body = (await request.json()) as {
        status?: ApplicationReviewStatus;
      };

      if (!body.status) return ApiResponse.badRequest("Missing status");

      await applicationService.updatePositionSelectionReviewStatus(
        scope,
        selectionId,
        body.status,
      );
      return ApiResponse.ok({ success: true });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update status";
      console.error("Error updating position selection review status:", error);
      return ApiResponse.serverError(errorMessage, "Failed to update status");
    }
  },
);
