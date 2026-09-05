import { RaftResponse } from "@uw-datasci/raft";
import { hiringService } from "@uwdsc/admin";
import { withPresAccess } from "@/guards/withPresAccess";

/**
 * GET /api/applications/hiring/team
 * Get the new exec team derived from Accepted Offer selections.
 */
export const GET = withPresAccess(async () => {
  const team = await hiringService.getNewExecTeam();
  return RaftResponse.ok({ team });
});
