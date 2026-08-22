import { RaftResponse } from "@uw-datasci/raft";
import { teamService } from "@uwdsc/core";
import { withAuth } from "@/guards/withAuth";

/**
 * GET /api/subteams
 * List every subteam (`{ id, name }`), for pickers such as the President's
 * member role/subteam editor. Admin/exec only.
 */
export const GET = withAuth(async () => {
  const subteams = await teamService.getSubteams();
  return RaftResponse.ok(subteams);
});
