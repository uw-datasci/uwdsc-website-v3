import { type ApplicationReviewStatus } from "@uwdsc/common/types";
import { RaftResponse } from "@uw-datasci/raft";
import { isAdmin } from "@uwdsc/common/constants";
import { applicationService } from "@uwdsc/admin";
import { withAdmin } from "@/guards/withAdmin";

interface ParamsContext {
  params: Promise<{ selectionId: string }>;
}

/**
 * PATCH /api/applications/review/[selectionId]
 * Update review status for a single position selection (VP subteam or President).
 */
export const PATCH = withAdmin<ParamsContext>(
  async (request, { params }, user, scope) => {
    if (!isAdmin(user.app_metadata?.role)) {
      return RaftResponse.unauthorized("You cannot perform this action");
    }

    const { selectionId } = await params;
    const body = (await request.json()) as { status?: ApplicationReviewStatus };
    if (!body.status) return RaftResponse.badRequest("Missing status");

    await applicationService.updatePositionStatus(scope, selectionId, body.status);
    return RaftResponse.ok({ success: true });
  },
  { scope: true }
);
