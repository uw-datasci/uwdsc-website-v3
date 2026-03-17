/**
 * GitHub API Functions
 *
 * Used by Foundry for fetching org teams, etc.
 */

import { createApiError } from "./error";

export interface GitHubTeam {
  value: string;
  label: string;
}

/**
 * Get teams in the GitHub organization.
 *
 * @returns Promise with array of GitHub teams
 * @throws Error if request fails or unauthorized
 */
export async function getGitHubOrgTeams(): Promise<GitHubTeam[]> {
  const response = await fetch("/api/github/teams");
  const data = await response.json();
  if (!response.ok) throw createApiError(data, response.status);
  return data;
}
