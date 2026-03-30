import { ApiError, type ApplicationReviewStatus } from "@uwdsc/common/types";
import { ApiResponse } from "@uwdsc/common/utils";
import { applicationService } from "@uwdsc/admin";
import { withVpAccess } from "@/guards/withVpAccess";
import {
  PRESIDENT_REVIEW_STATUS_SET,
  VP_REVIEW_STATUS_SET,
} from "@/constants/applications";

interface ParamsContext {
  params: Promise<{ id: string }>;
}

/**
 * PATCH /api/applications/review/[id]
 * Update application review status for scoped reviewers.
 */
export const PATCH = withVpAccess<ParamsContext>(
  async (request, { params }, _user, scope) => {
    try {
      const { id } = await params;
      const body = (await request.json()) as {
        status?: ApplicationReviewStatus;
      };

      const allowedStatuses = scope.isPresident
        ? PRESIDENT_REVIEW_STATUS_SET
        : VP_REVIEW_STATUS_SET;

      if (!body.status || !allowedStatuses.has(body.status)) {
        return ApiResponse.badRequest("Invalid status");
      }

      await applicationService.updateApplicationReviewStatus(
        scope,
        id,
        body.status,
      );
      return ApiResponse.ok({ success: true });
    } catch (error: unknown) {
      if (error instanceof ApiError) {
        return ApiResponse.json(
          { error: error.message, message: error.message },
          error.statusCode,
        );
      }
      console.error("Error updating application review status:", error);
      return ApiResponse.serverError(error, "Failed to update application");
    }
  },
);
