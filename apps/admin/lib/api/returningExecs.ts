import { createApiError } from "./error";
import type {
  ApplicationReviewStatus,
  ReturningExecListItem,
  ReturningExecOwnSubmission,
  ReturningExecSubmissionData,
} from "@uwdsc/common/types";
import type { PositionReviewScopeDto } from "./applications";

export interface ReturningExecsResponse {
  submissions: ReturningExecListItem[];
  positionReview: PositionReviewScopeDto;
}

export interface OwnSubmissionResponse {
  submission: ReturningExecOwnSubmission | null;
}

export interface AvailablePosition {
  id: number;
  position_id: number;
  name: string;
}

export async function getAvailablePositionsForReturningExec(): Promise<
  AvailablePosition[]
> {
  const response = await fetch("/api/returning-execs/positions");
  const data = await response.json();
  if (!response.ok) throw createApiError(data, response.status);
  return data as AvailablePosition[];
}

export async function getOwnReturningExecSubmission(): Promise<OwnSubmissionResponse> {
  const response = await fetch("/api/returning-execs/me");
  const data = await response.json();
  if (!response.ok) throw createApiError(data, response.status);
  return data as OwnSubmissionResponse;
}

export async function upsertReturningExecSubmission(
  body: ReturningExecSubmissionData,
): Promise<OwnSubmissionResponse> {
  const response = await fetch("/api/returning-execs/me", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  if (!response.ok) throw createApiError(data, response.status);
  return data as OwnSubmissionResponse;
}

export async function getAllReturningExecs(): Promise<ReturningExecsResponse> {
  const response = await fetch("/api/returning-execs");
  const data = await response.json();
  if (!response.ok) throw createApiError(data, response.status);
  return data as ReturningExecsResponse;
}

export async function updateReturningExecSelectionStatus(
  selectionId: string,
  status: ApplicationReviewStatus,
): Promise<void> {
  const response = await fetch(
    `/api/returning-execs/selections/${selectionId}`,
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
