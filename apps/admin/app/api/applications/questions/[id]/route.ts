import { ApiError } from "@uwdsc/common/types";
import { ApiResponse } from "@uwdsc/common/utils";
import { applicationService } from "@uwdsc/admin";
import type { WithAuthContext } from "@/guards/withAuth";
import { withVpAccess } from "@/guards/withVpAccess";
import { questionSchema } from "@/lib/schemas/questions";

interface Params extends WithAuthContext {
  params: Promise<{ id: string }>;
}

/**
 * PATCH /api/applications/questions/[id]
 * Update a scoped question.
 */
export const PATCH = withVpAccess<Params>(async (request, { params }, _user, scope) => {
  try {
    const { id } = await params;
    const positionQuestionId = Number(id);
    if (!Number.isInteger(positionQuestionId) || positionQuestionId <= 0) {
      return ApiResponse.badRequest("Invalid question identifier");
    }

    const body = await request.json();
    const parsed = questionSchema.safeParse(body);
    if (!parsed.success) {
      return ApiResponse.badRequest(
        parsed.error.issues[0]?.message ?? "Invalid question payload",
      );
    }

    const updated = await applicationService.updateQuestion(
      scope,
      positionQuestionId,
      parsed.data,
    );
    if (!updated) return ApiResponse.badRequest("Question not found", "Not found");

    return ApiResponse.ok({
      success: true,
      question: updated,
    });
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      return ApiResponse.json(
        { error: error.message, message: error.message },
        error.statusCode,
      );
    }
    console.error("Error updating scoped application question:", error);
    return ApiResponse.serverError(error, "Failed to update question");
  }
});

/**
 * DELETE /api/applications/questions/[id]
 * Delete a scoped question.
 */
export const DELETE = withVpAccess<Params>(async (_request, { params }, _user, scope) => {
  try {
    const { id } = await params;
    const positionQuestionId = Number(id);
    if (!Number.isInteger(positionQuestionId) || positionQuestionId <= 0) {
      return ApiResponse.badRequest("Invalid question identifier");
    }

    const deleted = await applicationService.deleteQuestion(scope, positionQuestionId);
    if (!deleted) return ApiResponse.badRequest("Question not found", "Not found");

    return ApiResponse.ok({ success: true });
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      return ApiResponse.json(
        { error: error.message, message: error.message },
        error.statusCode,
      );
    }
    console.error("Error deleting scoped application question:", error);
    return ApiResponse.serverError(error, "Failed to delete question");
  }
});
