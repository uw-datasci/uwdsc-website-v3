/**
 * Applications API Functions
 *
 * Client-side API calls for the applications admin portal.
 */

import { createApiError } from "./error";
import type {ExecPosition } from "@uwdsc/common/types";

/**
 * Get all submitted applications with full details
 *
 * @returns Promise with array of all applications
 * @throws Error if request fails or unauthorized
 */
export async function getAllExecPositions(): Promise<ExecPosition[]> {
  const response = await fetch("/api/onboarding/positions");

  const data = await response.json();

  if (!response.ok) throw createApiError(data, response.status);

  return data;
}
