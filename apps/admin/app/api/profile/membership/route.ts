import { RaftResponse } from "@uw-datasci/raft";
import { withRaftRoute } from "@uwdsc/core/http";
import { membershipService } from "@uwdsc/core";
import { tryGetCurrentUser } from "@/lib/api/utils";

export const GET = withRaftRoute(async () => {
  const { user, isUnauthorized } = await tryGetCurrentUser();
  if (isUnauthorized) return isUnauthorized;
  if (!user) return RaftResponse.unauthorized("Authentication required");

  const status = await membershipService.getMembershipStatus(user.id);
  return RaftResponse.ok(status);
});
