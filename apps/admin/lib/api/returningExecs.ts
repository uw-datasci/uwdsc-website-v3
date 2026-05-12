import { createApiError } from "./error";
import type { ApplicationReviewStatus, ReturningExecSubmissionData } from "@uwdsc/common/types";
import type {
  AvailablePosition,
  OwnSubmissionResponse,
  ReturningExecsResponse,
} from "@/types/returningExecs";

export async function getAvailablePositionsForReturningExec(): Promise<AvailablePosition[]> {
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
  const response = await fetch(`/api/returning-execs/selections/${selectionId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  if (!response.ok) {
    const data = await response.json();
    throw createApiError(data, response.status);
  }
}
