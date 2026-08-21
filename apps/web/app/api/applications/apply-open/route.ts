import { RaftResponse } from "@uw-datasci/raft";
import { withRaftRoute } from "@uwdsc/core/http";
import { isApplicationWindowOpen } from "@uwdsc/common/utils";
import { applicationService } from "@uwdsc/core";

/** Public: whether the exec apply page should be linked in navigation. */
export const GET = withRaftRoute(async () => {
  const term = await applicationService.getActiveTerm();
  const open = Boolean(term && isApplicationWindowOpen(term));
  // Only expose term details while the window is open, so an unreleased
  // term's dates never leak from this unauthenticated route. The window
  // now stays open through the hard deadline, so both dates are exposed
  // together -- hardDeadline lets the UI show a grace-period countdown
  // once the (display-only) soft deadline has passed.
  return RaftResponse.ok({
    open,
    softDeadline: open ? (term?.application_soft_deadline ?? null) : null,
    hardDeadline: open ? (term?.application_hard_deadline ?? null) : null,
    termCode: open ? (term?.code ?? null) : null,
  });
});
