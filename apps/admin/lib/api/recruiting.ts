/**
 * Recruiting API Functions
 *
 * Client-side API calls for the Recruiting section.
 */

import type { RecruitingCapabilities, RecruitingCycleSummary } from "@uwdsc/common/recruiting";
import type {
  CreateQuestionInput,
  HiringPick,
  LeadershipDraft,
  MoveCardInput,
  ReorderQuestionsInput,
  ScheduleInput,
  UpdatePositionInput,
  UpdateQuestionInput,
} from "@uwdsc/common/schemas";
import type {
  BoardView,
  CandidateView,
  LeadershipPerson,
  LeadershipView,
  SetupView,
} from "@uwdsc/common/types";
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

/** Schedule, cycle positions and the question bank (after the lock). */
export async function getSetup(): Promise<SetupView> {
  const response = await fetch("/api/recruiting/setup");
  const data = await parseJsonResponse<SetupView>(response);
  if (!response.ok) throw createApiError(data, response.status);
  return data;
}

export function updateSchedule(input: ScheduleInput): Promise<void> {
  return sendJson("/api/recruiting/setup/schedule", "PUT", input);
}

export function addCyclePosition(positionId: number): Promise<void> {
  return sendJson("/api/recruiting/setup/positions", "POST", { positionId });
}

export function updateCyclePosition(id: number, patch: UpdatePositionInput): Promise<void> {
  return sendJson(`/api/recruiting/setup/positions/${id}`, "PATCH", patch);
}

export function createQuestion(input: CreateQuestionInput): Promise<void> {
  return sendJson("/api/recruiting/setup/questions", "POST", input);
}

export function updateQuestion(id: number, input: UpdateQuestionInput): Promise<void> {
  return sendJson(`/api/recruiting/setup/questions/${id}`, "PATCH", input);
}

export function reorderQuestions(input: ReorderQuestionsInput): Promise<void> {
  return sendJson("/api/recruiting/setup/questions/order", "PUT", input);
}

/** Every card in the cycle plus the positions and subteams to filter by. */
export async function getBoard(): Promise<BoardView> {
  const response = await fetch("/api/recruiting/board");
  const data = await parseJsonResponse<BoardView>(response);
  if (!response.ok) throw createApiError(data, response.status);
  return data;
}

/** Move a card. Fails with 409 if it changed since `input.from` was read. */
export function moveCard(selectionId: string, input: MoveCardInput): Promise<void> {
  return sendJson(`/api/recruiting/selections/${selectionId}`, "PATCH", input);
}

/** The full application behind a card. */
export async function getCandidate(applicationId: string): Promise<CandidateView> {
  const response = await fetch(`/api/recruiting/candidates/${applicationId}`);
  const data = await parseJsonResponse<CandidateView>(response);
  if (!response.ok) throw createApiError(data, response.status);
  return data;
}

/** A signed resume URL, made on demand. Null if the candidate has no resume. */
export async function getCandidateResumeUrl(applicationId: string): Promise<string | null> {
  const response = await fetch(`/api/recruiting/candidates/${applicationId}/resume`);
  const data = await parseJsonResponse<{ url: string | null }>(response);
  if (!response.ok) throw createApiError(data, response.status);
  return data.url;
}
