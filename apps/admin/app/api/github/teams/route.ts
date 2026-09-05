import { RaftResponse } from "@uw-datasci/raft";
import { withAdmin } from "@/guards/withAdmin";
import { githubService } from "@uwdsc/admin";

/**
 * GET /api/github/teams
 * Returns the list of teams in the GitHub organization.
 *
 * Admin only.
 */
export const GET = withAdmin(async () => {
  const teams = await githubService.getTeams();
  return RaftResponse.ok(teams.map((t) => ({ value: t.slug, label: t.name })));
});
