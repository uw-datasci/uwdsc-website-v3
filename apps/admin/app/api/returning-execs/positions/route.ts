import { RaftResponse } from "@uw-datasci/raft";
import { isReturningExecWindowOpen } from "@uwdsc/common/utils";
import { returningExecService } from "@uwdsc/admin";
import { withAuth } from "@/guards/withAuth";

/**
 * GET /api/returning-execs/positions
 * Returns every exec position (excluding Presidents and Advisors) for the
 * returning exec form. Not gated by the public application's position toggles.
 */
export const GET = withAuth(
  async () => {
    const term = await returningExecService.getActiveTerm();
    if (!term || !isReturningExecWindowOpen(term)) {
      return RaftResponse.forbidden(
        "Returning exec form is not available at this time",
        "Form not available"
      );
    }
    const positions = await returningExecService.getSelectablePositions();
    return RaftResponse.ok(positions);
  },
  { allowAlum: true }
);
