import { type ApplicationReviewStatus, type QuestionScope } from "@uwdsc/common/types";
import { RaftResponse } from "@uw-datasci/raft";
import { hiringService, returningExecService } from "@uwdsc/admin";
import { withPresAccess } from "@/guards/withPresAccess";

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
    const { id } = await params;
    const body = (await request.json()) as {
      status?: ApplicationReviewStatus;
      source?: "application" | "returning_exec";
    };

    if (!body.status) {
      return RaftResponse.badRequest("Status is required");
    }

    if (body.source === "returning_exec") {
      await returningExecService.updateSelectionReviewStatus(scope, id, body.status);
    } else {
      await hiringService.updateSelectionStatus(id, body.status);
    }

    return RaftResponse.ok({ success: true });
  }
);
