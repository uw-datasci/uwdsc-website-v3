/**
 * GitHub API Functions
 *
 * Used by Foundry for fetching org teams, etc.
 */

import type { GitHubTeam, GitHubTemplateOption } from "@uwdsc/common/types";
import { createApiError } from "./error";
import type { FoundryFormValues } from "@/lib/schemas/foundry";

/**
 * Get teams in the GitHub organization.
 *
 * @returns Promise with array of GitHub teams
 * @throws Error if request fails or unauthorized
 */
export async function getGitHubTeams(): Promise<GitHubTeam[]> {
  const response = await fetch("/api/github/teams");
  const data = await response.json();
  if (!response.ok) throw createApiError(data, response.status);
  return data;
}

/**
 * Get template repos in the GitHub organization.
 *
 * @returns Promise with array of template repos
 * @throws Error if request fails or unauthorized
 */
export async function getGitHubTemplateRepos(): Promise<
  GitHubTemplateOption[]
> {
  const response = await fetch("/api/github/templates");
  const data = await response.json();
  if (!response.ok) throw createApiError(data, response.status);
  return data;
}

/**
 * Launches a Foundry project by dispatching provisioning workflow.
 *
 * @param payload - validated Foundry form values
 * @throws Error if dispatch fails or unauthorized
 */
export async function launchFoundryProject(
  payload: FoundryFormValues,
): Promise<{ success: boolean; message: string }> {
  const response = await fetch("/api/github/foundry/launch", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  if (!response.ok) throw createApiError(data, response.status);
  return data;
}
