/**
 * Hiring API Functions
 *
 * Client-side API calls for the hiring dashboard (president-only).
 */

import { createApiError } from "./error";
import type {
  ApplicationReviewStatus,
  FinalizeRolesSummary,
  HiringApplicant,
  NewExecTeamMember,
} from "@uwdsc/common/types";

export interface HiringApplicantsResponse {
  applicants: HiringApplicant[];
}

export async function getHiringApplicants(): Promise<HiringApplicantsResponse> {
  const response = await fetch("/api/applications/hiring");
  const data = await response.json();
  if (!response.ok) throw createApiError(data, response.status);
  return data as HiringApplicantsResponse;
}

export async function updateSelectionStatus(
  selectionId: string,
  status: ApplicationReviewStatus,
): Promise<void> {
  const response = await fetch(
    `/api/applications/hiring/selections/${selectionId}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    },
  );
  if (!response.ok) {
    const data = await response.json();
    throw createApiError(data, response.status);
  }
}

export interface NewExecTeamResponse {
  team: NewExecTeamMember[];
}

export async function getNewExecTeam(): Promise<NewExecTeamResponse> {
  const response = await fetch("/api/applications/hiring/team");
  const data = await response.json();
  if (!response.ok) throw createApiError(data, response.status);
  return data as NewExecTeamResponse;
}

export interface FinalizeRolesResponse {
  summary: FinalizeRolesSummary;
}

export async function finalizeRoles(): Promise<FinalizeRolesResponse> {
  const response = await fetch("/api/applications/hiring/finalize", {
    method: "POST",
  });
  const data = await response.json();
  if (!response.ok) throw createApiError(data, response.status);
  return data as FinalizeRolesResponse;
}
