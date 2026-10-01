import { RaftResponse } from "@uw-datasci/raft";
import { withRaftRoute } from "@uwdsc/core/http";
import { passportService } from "@uwdsc/core";
import { tryGetCurrentUser } from "@/lib/api/utils";

export const POST = withRaftRoute(async (request) => {
  const { user, isUnauthorized } = await tryGetCurrentUser();
  if (!user) return isUnauthorized;

  const { membership_id, event_id, token } = await request.json();
  if (!membership_id || !event_id || !token) {
    return RaftResponse.badRequest("membership_id, event_id and token are required");
  }

  const result = await passportService.scanQrCode(user.id, {
    membershipId: membership_id,
    eventId: event_id,
    token,
  });

  return RaftResponse.ok(result);
});
