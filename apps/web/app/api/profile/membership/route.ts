import { RaftResponse } from "@uw-datasci/raft";
import { withRaftRoute } from "@uwdsc/core/http";
import { membershipService } from "@uwdsc/core";
import { tryGetCurrentUser } from "@/lib/api/utils";

export const GET = withRaftRoute(async () => {
  const { user, isUnauthorized } = await tryGetCurrentUser();
  if (!user) return isUnauthorized;

  const status = await membershipService.getMembershipStatus(user.id);
  return RaftResponse.ok(status);
});
