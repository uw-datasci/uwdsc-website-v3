import { RaftResponse } from "@uw-datasci/raft";
import { withRaftRoute } from "@uwdsc/core/http";
import { isApplicationWindowOpen } from "@uwdsc/common/utils";
import { tryGetCurrentUser } from "@/lib/api/utils";
import { applicationService } from "@uwdsc/core";

export const GET = withRaftRoute(async () => {
  const { user, isUnauthorized } = await tryGetCurrentUser();
  if (!user) return isUnauthorized;

  const term = await applicationService.getActiveTerm();
  if (!term || !isApplicationWindowOpen(term)) {
    return RaftResponse.notFound("No active application period");
  }

  return RaftResponse.ok(term);
});
