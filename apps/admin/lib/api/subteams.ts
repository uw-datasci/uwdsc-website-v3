/**
 * Subteams API Functions
 *
 * This file contains all subteam-related API calls.
 * Components should use these functions instead of making direct fetch calls.
 */

import type { SubteamOption } from "@uwdsc/common/types";
import { createApiError } from "./error";

/**
 * Get every subteam (`{ id, name }`), ordered as seeded.
 *
 * @returns Promise with array of subteams
 * @throws Error if request fails or unauthorized
 */
export async function getSubteams(): Promise<SubteamOption[]> {
  const response = await fetch("/api/subteams");

  const data = await response.json();

  if (!response.ok) throw createApiError(data, response.status);

  return data;
}
