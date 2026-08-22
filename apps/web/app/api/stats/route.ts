import { RaftResponse } from "@uw-datasci/raft";
import { withRaftRoute } from "@uwdsc/core/http";
import { eventService, profileService } from "@uwdsc/core";

function roundUpToTens(n: number): number {
  return Math.ceil(n / 10) * 10;
}

/**
 * GET /api/stats
 * Public hero metrics: member (profile) count and event count, each rounded up to the nearest 10.
 */
export const GET = withRaftRoute(async () => {
  const [rawMembers, rawEvents] = await Promise.all([
    profileService.getProfileCount(),
    eventService.getEventCount(),
  ]);

  return RaftResponse.ok({
    members: roundUpToTens(rawMembers),
    events: roundUpToTens(rawEvents),
  });
});
