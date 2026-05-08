import { ApiError, type ApplicationReviewStatus } from "@uwdsc/common/types";
import { ApiResponse } from "@uwdsc/common/utils";
import { hiringService, returningExecService } from "@uwdsc/admin";
import { withPresAccess } from "@/guards/withPresAccess";
import type { QuestionScope } from "@uwdsc/common/types";

interface ParamsContext {
  params: Promise<{ id: string }>;
}

/**
 * PATCH /api/applications/hiring/selections/[id]
 * Update a single position selection's review status (president-only statuses).
 * Dispatches to the correct service based on whether the selection belongs to
 * a regular application or a returning-exec submission.
 */
export const PATCH = withPresAccess<ParamsContext>(
  async (request, { params }, _user, scope: QuestionScope) => {
    try {
      const { id } = await params;
      const body = (await request.json()) as {
        status?: ApplicationReviewStatus;
        source?: "application" | "returning_exec";
      };

      if (!body.status) {
        return ApiResponse.badRequest("Status is required");
      }

      if (body.source === "returning_exec") {
        await returningExecService.updateSelectionReviewStatus(
          scope,
          id,
          body.status,
        );
      } else {
        await hiringService.updateSelectionStatus(id, body.status);
      }

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
