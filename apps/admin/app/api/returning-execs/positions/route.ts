import { RaftResponse } from "@uw-datasci/raft";
import { isDateWindowOpen } from "@uwdsc/common/utils";
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
    const isReturningExecWindowOpen = isDateWindowOpen(
      term?.returning_exec_release_date,
      term?.returning_exec_deadline
    );

    if (!term || !isReturningExecWindowOpen) {
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
