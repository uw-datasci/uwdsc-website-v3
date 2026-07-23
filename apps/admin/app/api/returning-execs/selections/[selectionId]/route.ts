import {
  ApiError,
  type ApplicationReviewStatus,
  type QuestionScope,
} from "@uwdsc/common/types";
import { ApiResponse } from "@uwdsc/common/utils";
import { isAdmin } from "@uwdsc/common/constants";
import { returningExecService } from "@uwdsc/admin";
import { withVpAccess } from "@/guards/withVpAccess";

interface ParamsContext {
  params: Promise<{ selectionId: string }>;
}

/**
 * PATCH /api/returning-execs/selections/[selectionId]
 * Update the review status of a returning-exec position selection.
 * VPs can update VP-level statuses; presidents can update all statuses.
 */
export const PATCH = withVpAccess<ParamsContext>(
  async (request, { params }, user, scope: QuestionScope) => {
    if (!isAdmin(user.app_metadata?.role)) {
      return ApiResponse.unauthorized(
        "Only users with the admin role can update returning exec selection status",
      );
    }

    try {
      const { selectionId } = await params;
      const body = (await request.json()) as { status?: ApplicationReviewStatus };

      if (!body.status) {
        return ApiResponse.badRequest("Missing status");
      }

      await returningExecService.updateSelectionReviewStatus(scope, selectionId, body.status);
      return ApiResponse.ok({ success: true });
    } catch (error: unknown) {
      if (error instanceof ApiError) {
        if (error.statusCode === 403) {
          return ApiResponse.forbidden(error.message, error.code ?? error.message);
        }
        return ApiResponse.json(
          { error: error.message, message: error.message },
          error.statusCode,
        );
      }
      console.error("Error updating returning exec selection status:", error);
      return ApiResponse.serverError(error, "Failed to update status");
    }
  },
);
