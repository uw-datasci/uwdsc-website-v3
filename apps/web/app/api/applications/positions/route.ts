import { RaftResponse } from "@uw-datasci/raft";
import { withRaftRoute } from "@uwdsc/core/http";
import { tryGetCurrentUser } from "@/lib/api/utils";
import { applicationService } from "@uwdsc/core";

export const GET = withRaftRoute(async () => {
  const { user, isUnauthorized } = await tryGetCurrentUser();
  if (!user) return isUnauthorized;

  const { term, cycleId, open } = await applicationService.getApplyWindow();
  if (!term) return RaftResponse.notFound("No active application period");
  if (!open || !cycleId) return RaftResponse.forbidden("The application period is closed.");

  const data = await applicationService.getPositionsWithQuestions(cycleId);
  return RaftResponse.ok(data);
});
