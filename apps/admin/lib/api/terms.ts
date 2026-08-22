/**
 * Terms API Functions
 *
 * This file contains all term-related API calls.
 * Components should use these functions instead of making direct fetch calls.
 */

import type { Term } from "@uwdsc/common/types";
import type { TermScheduleFormValues } from "@/lib/schemas/termSchedule";
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

/**
 * Get the active term, if any.
 *
 * @returns Promise with the active term, or null if none is active
 * @throws Error if request fails or unauthorized
 */
export async function getActiveTerm(): Promise<Term | null> {
  const response = await fetch("/api/terms/active");
  const data = await response.json();
  if (!response.ok) throw createApiError(data, response.status);
  return (data as { term: Term | null }).term;
}

/**
 * Update the active term's application schedule (release date, soft
 * deadline, hard deadline). President only.
 *
 * @throws Error if request fails, unauthorized, or there is no active term
 */
export async function updateActiveTermSchedule(
  values: TermScheduleFormValues,
): Promise<Term> {
  const response = await fetch("/api/terms/active", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });
  const data = await response.json();
  if (!response.ok) throw createApiError(data, response.status);
  return (data as { term: Term }).term;
}
