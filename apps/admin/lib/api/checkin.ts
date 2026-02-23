import { createApiError } from "./error";
import type { Profile } from "@uwdsc/common/types";

interface CheckInResponse {
  success: boolean;
  profile: Profile;
}

interface UncheckInResponse {
  success: boolean;
}

export async function validateAndCheckIn(data: {
  event_id: string;
  membership_id: string;
  token: string;
}): Promise<CheckInResponse> {
  const response = await fetch("/api/checkin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const result = await response.json();
  if (!response.ok) throw createApiError(result, response.status);
  return result;
}

export async function manualCheckIn(data: {
  event_id: string;
  profile_id: string;
}): Promise<CheckInResponse> {
  const response = await fetch("/api/checkin/manual", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const result = await response.json();
  if (!response.ok) throw createApiError(result, response.status);
  return result;
}

export async function uncheckIn(data: {
  event_id: string;
  profile_id: string;
}): Promise<UncheckInResponse> {
  const response = await fetch("/api/checkin", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const result = await response.json();
  if (!response.ok) throw createApiError(result, response.status);
  return result;
}
