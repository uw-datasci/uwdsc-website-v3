/**
 * Recruiting API Functions
 *
 * Client-side API calls for the Recruiting section.
 */

import type { RecruitingCapabilities, RecruitingCycleSummary } from "@uwdsc/common/recruiting";
import { createApiError } from "./error";
import { parseJsonResponse } from "./parse-response";

export interface StartableTerm {
  id: string;
  code: string;
  start_date: string;
}

/** The viewer's capabilities for the current hiring cycle. */
export async function getRecruitingContext(): Promise<RecruitingCapabilities> {
  const response = await fetch("/api/recruiting/context");
  const data = await parseJsonResponse<RecruitingCapabilities>(response);
  if (!response.ok) throw createApiError(data, response.status);
  return data;
}

/** Terms a new hiring cycle can target (presidents only). */
export async function getStartableTerms(): Promise<StartableTerm[]> {
  const response = await fetch("/api/recruiting/cycle/terms");
  const data = await parseJsonResponse<{ terms: StartableTerm[] }>(response);
  if (!response.ok) throw createApiError(data, response.status);
  return data.terms;
}

/** Start the hiring cycle for the active term, hiring for `targetTermId` (presidents only). */
export async function startRecruitingCycle(targetTermId: string): Promise<RecruitingCycleSummary> {
  const response = await fetch("/api/recruiting/cycle", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ targetTermId }),
  });
  const data = await parseJsonResponse<RecruitingCycleSummary>(response);
  if (!response.ok) throw createApiError(data, response.status);
  return data;
}
