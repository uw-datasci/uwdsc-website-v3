import { RaftResponse } from "@uw-datasci/raft";
import { leadershipService } from "@uwdsc/admin";
import { requireLeadership, withRecruiting } from "@/guards/withRecruiting";

/**
 * GET /api/recruiting/leadership/people?q=
 * Search people to seat as a president or VP.
 */
export const GET = withRecruiting(async (request) => {
  const query = new URL(request.url).searchParams.get("q") ?? "";
  const people = await leadershipService.searchPeople(query.slice(0, 100));
  return RaftResponse.ok({ people });
}, requireLeadership);
