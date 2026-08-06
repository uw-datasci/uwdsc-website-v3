import { ApiResponse } from "@uwdsc/common/utils";
import { withAdmin } from "@/guards/withAdmin";
import { githubService } from "@uwdsc/admin";

/**
 * GET /api/github/teams
 * Returns the list of teams in the GitHub organization.
 *
 * Admin only.
 */
export const GET = withAdmin(async () => {
  try {
    const teams = await githubService.getTeams();

    return ApiResponse.ok(
      teams.map((t) => ({
        value: t.slug,
        label: t.name,
      })),
    );
  } catch (error: unknown) {
    console.error("Error fetching GitHub teams:", error);
    return ApiResponse.serverError(error, "Failed to fetch GitHub teams");
  }
});
