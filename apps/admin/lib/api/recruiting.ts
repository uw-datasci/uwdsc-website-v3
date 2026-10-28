/**
 * Recruiting API Functions
 *
 * Client-side API calls for the Recruiting section.
 */

import type { RecruitingCapabilities, RecruitingCycleSummary } from "@uwdsc/common/recruiting";
import type { HiringPick, LeadershipDraft } from "@uwdsc/common/schemas";
import type { LeadershipPerson, LeadershipView } from "@uwdsc/common/types";
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
export async function startRecruitingCycle(
  targetTermId: string
): Promise<RecruitingCycleSummary> {
  const response = await fetch("/api/recruiting/cycle", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ targetTermId }),
  });
  const data = await parseJsonResponse<RecruitingCycleSummary>(response);
  if (!response.ok) throw createApiError(data, response.status);
  return data;
}

async function sendJson<T>(url: string, method: string, body: unknown): Promise<T> {
  const response = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await parseJsonResponse<T>(response);
  if (!response.ok) throw createApiError(data, response.status);
  return data;
}

/** Roster, current leaders and hiring picks for the current cycle (presidents only). */
export async function getLeadership(): Promise<LeadershipView> {
  const response = await fetch("/api/recruiting/leadership");
  const data = await parseJsonResponse<LeadershipView>(response);
  if (!response.ok) throw createApiError(data, response.status);
  return data;
}

/** Save the roster and hiring picks without locking. */
export function saveLeadershipDraft(
  draft: LeadershipDraft,
  hiring: HiringPick[]
): Promise<LeadershipView> {
  return sendJson("/api/recruiting/leadership/draft", "PUT", { draft, hiring });
}

/** Lock next term's leadership; role changes apply immediately. */
export function lockLeadership(draft: LeadershipDraft, hiring: HiringPick[]): Promise<void> {
  return sendJson("/api/recruiting/leadership/lock", "POST", { draft, hiring });
}

/** Apply roster edits after the lock. */
export function updateLeadership(draft: LeadershipDraft): Promise<LeadershipView> {
  return sendJson("/api/recruiting/leadership", "PUT", { draft });
}

/** Search people to seat as a president or VP. */
export async function searchLeadershipPeople(query: string): Promise<LeadershipPerson[]> {
  const response = await fetch(
    `/api/recruiting/leadership/people?q=${encodeURIComponent(query)}`
  );
  const data = await parseJsonResponse<{ people: LeadershipPerson[] }>(response);
  if (!response.ok) throw createApiError(data, response.status);
  return data.people;
}
