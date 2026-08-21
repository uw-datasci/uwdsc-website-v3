import { type ApplicationReviewStatus, type QuestionScope } from "@uwdsc/common/types";
import { RaftResponse } from "@uw-datasci/raft";
import { isAdmin } from "@uwdsc/common/constants";
import { returningExecService } from "@uwdsc/admin";
import { withAdmin } from "@/guards/withAdmin";

interface ParamsContext {
  params: Promise<{ selectionId: string }>;
}

/**
 * PATCH /api/returning-execs/selections/[selectionId]
 * Update the review status of a returning-exec position selection.
 * VPs can update VP-level statuses; presidents can update all statuses.
 */
export const PATCH = withAdmin<ParamsContext>(
  async (request, { params }, user, scope: QuestionScope) => {
    if (!isAdmin(user.app_metadata?.role)) {
      return RaftResponse.unauthorized("You cannot perform this action");
    }

    const { selectionId } = await params;
    const body = (await request.json()) as { status?: ApplicationReviewStatus };

    if (!body.status) return RaftResponse.badRequest("Missing status");

    await returningExecService.updateSelectionReviewStatus(scope, selectionId, body.status);
    return RaftResponse.ok({ success: true });
  },
  { scope: true }
);
