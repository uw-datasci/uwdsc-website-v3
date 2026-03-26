/**
 * Applications API Functions
 *
 * Client-side API calls for the applications admin portal.
 */

import { createApiError } from "./error";
import type {ExecPosition, Term, Onboarding } from "@uwdsc/common/types";

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

export async function getActiveTerm(): Promise<Term> {
  const response = await fetch("/api/onboarding/term");
  const data = await response.json();
  if (!response.ok) throw createApiError(data, response.status);
  return data;
}

export async function submitOnboardingForm(
  payload: Onboarding
): Promise<Onboarding> {
  const response = await fetch("/api/onboarding/submission", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  if (!response.ok) throw createApiError(data, response.status);
}