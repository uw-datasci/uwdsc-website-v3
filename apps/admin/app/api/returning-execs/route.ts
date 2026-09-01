import { RaftResponse } from "@uw-datasci/raft";
import { isAdmin } from "@uwdsc/common/constants";
import { returningExecService } from "@uwdsc/admin";
import { withAdmin } from "@/guards/withAdmin";
import type { QuestionScope } from "@uwdsc/common/types";

/**
 * GET /api/returning-execs
 * Returns all returning-exec submissions for the active term.
 * Requires admin role + VP or president scope.
 */
export const GET = withAdmin(
  async (_request, _context, user, scope: QuestionScope) => {
    if (!isAdmin(user.app_metadata?.role)) {
      return RaftResponse.unauthorized("You cannot perform this action");
    }

    const { submissions } = await returningExecService.getAllSubmissionsForActiveTerm();
    return RaftResponse.ok({
      submissions,
      positionReview: {
        canUse: true,
        isPresident: scope.isPresident,
        vpPositionIds: scope.vpPositionIds,
        vpExecPositionIds: scope.vpExecPositionIds,
      },
    });
  },
  { scope: true }
);
