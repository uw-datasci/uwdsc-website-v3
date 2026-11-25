/**
 * Terms API Functions
 *
 * This file contains all term-related API calls.
 * Components should use these functions instead of making direct fetch calls.
 */

import type { Term } from "@uwdsc/common/types";
import { createApiError } from "./error";

/**
 * Get all retained terms (newest first).
 *
 * @returns Promise with array of terms
 * @throws Error if request fails or unauthorized
 */
export async function getAllTerms(): Promise<Term[]> {
  const response = await fetch("/api/terms");

  const data = await response.json();

  if (!response.ok) throw createApiError(data, response.status);

  return data;
}
