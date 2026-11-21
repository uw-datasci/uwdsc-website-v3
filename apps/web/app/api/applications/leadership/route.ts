import { RaftResponse } from "@uw-datasci/raft";
import { withRaftRoute } from "@uwdsc/core/http";
import { tryGetCurrentUser } from "@/lib/api/utils";
import { applicationService } from "@uwdsc/core";

/** The viewer's seat on next term's leadership, or null if they can apply. */
export const GET = withRaftRoute(async () => {
  const { user, isUnauthorized } = await tryGetCurrentUser();
  if (!user) return isUnauthorized;

  const { cycleId, open } = await applicationService.getApplyWindow();
  if (!open || !cycleId) return RaftResponse.notFound("No active application period");

  const seat = await applicationService.getLeadershipSeat(user.id, cycleId);
  return RaftResponse.ok({ seat });
});
