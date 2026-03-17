import { ApiResponse } from "@uwdsc/common/utils";
import { GITHUB_TEAMS_FALLBACK } from "@/constants/foundry";

/**
 * GET /api/github/teams
 * Returns the list of teams in the GitHub organization.
 *
 * TODO: Replace hardcoded fallback with real GitHub API call
 * e.g. GET https://api.github.com/orgs/{org}/teams using a stored PAT
 */
export async function GET() {
  try {
    const teams = [...GITHUB_TEAMS_FALLBACK];
    return ApiResponse.ok(teams);
  } catch (error: unknown) {
    console.error("Error fetching GitHub teams:", error);
    return ApiResponse.serverError(error, "Failed to fetch GitHub teams");
  }
}
