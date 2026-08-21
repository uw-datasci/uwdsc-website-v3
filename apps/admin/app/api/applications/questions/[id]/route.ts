import { RaftResponse } from "@uw-datasci/raft";
import { applicationService } from "@uwdsc/admin";
import type { WithAuthContext } from "@/guards/withAuth";
import { withAdmin } from "@/guards/withAdmin";
import { questionSchema } from "@/lib/schemas/questions";

interface Params extends WithAuthContext {
  params: Promise<{ id: string }>;
}

/**
 * PATCH /api/applications/questions/[id]
 * Update a scoped question.
 */
export const PATCH = withAdmin<Params>(
  async (request, { params }, _user, scope) => {
    const { id } = await params;
    const positionQuestionId = Number(id);
    if (!Number.isInteger(positionQuestionId) || positionQuestionId <= 0) {
      return RaftResponse.badRequest("Invalid question identifier");
    }

    const body = await request.json();
    const parsed = questionSchema.safeParse(body);
    if (!parsed.success) {
      return RaftResponse.badRequest(
        parsed.error.issues[0]?.message ?? "Invalid question payload"
      );
    }

    const updated = await applicationService.updateQuestion(
      scope,
      positionQuestionId,
      parsed.data
    );
    if (!updated) return RaftResponse.badRequest("Question not found", "Not found");

    return RaftResponse.ok({
      success: true,
      question: updated,
    });
  },
  { scope: true }
);

/**
 * DELETE /api/applications/questions/[id]
 * Delete a scoped question.
 */
export const DELETE = withAdmin<Params>(
  async (_request, { params }, _user, scope) => {
    const { id } = await params;
    const positionQuestionId = Number(id);
    if (!Number.isInteger(positionQuestionId) || positionQuestionId <= 0) {
      return RaftResponse.badRequest("Invalid question identifier");
    }

    const deleted = await applicationService.deleteQuestion(scope, positionQuestionId);
    if (!deleted) return RaftResponse.badRequest("Question not found", "Not found");

    return RaftResponse.ok({ success: true });
  },
  { scope: true }
);
