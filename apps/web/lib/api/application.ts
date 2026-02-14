/**
 * Application API Functions
 *
 * This file contains all application-related API calls.
 * Components should use these functions instead of making direct fetch calls.
 */

import type {
  ApplicationUpdatePayload,
  ApplicationWithDetails,
  GeneralQuestion,
  PositionWithQuestions,
  ProfileAutofill,
  Term,
} from "@uwdsc/common/types";
import { createApiError } from "./errors";

export interface PositionsWithQuestionsResponse {
  generalQuestions: GeneralQuestion[];
  positions: PositionWithQuestions[];
}

export async function getActiveTerm(): Promise<Term> {
  const response = await fetch("/api/applications/term");
  const data = await response.json();
  if (!response.ok) throw createApiError(data, response.status);
  return data;
}

export async function getPositionsWithQuestions(): Promise<PositionsWithQuestionsResponse> {
  const response = await fetch("/api/applications/positions");
  const data = await response.json();
  if (!response.ok) throw createApiError(data, response.status);
  return data;
}

export async function getProfileAutofill(): Promise<ProfileAutofill> {
  const response = await fetch("/api/applications/autofill");
  const data = await response.json();
  if (!response.ok) throw createApiError(data, response.status);
  return data;
}

export async function getApplication(
  termId: string,
): Promise<ApplicationWithDetails | null> {
  const response = await fetch(
    `/api/applications?termId=${encodeURIComponent(termId)}`,
  );
  const data = await response.json();
  if (!response.ok) throw createApiError(data, response.status);
  return data;
}

export async function createApplication(
  termId: string,
): Promise<ApplicationWithDetails> {
  const response = await fetch("/api/applications", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ termId }),
  });
  const data = await response.json();
  if (!response.ok) throw createApiError(data, response.status);
  return data;
}

export async function updateApplication(
  id: string,
  payload: ApplicationUpdatePayload,
): Promise<ApplicationWithDetails> {
  const response = await fetch(`/api/applications/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  if (!response.ok) throw createApiError(data, response.status);
  return data;
}
