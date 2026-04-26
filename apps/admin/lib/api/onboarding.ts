/**
 * Applications API Functions
 *
 * Client-side API calls for the applications admin portal.
 */

import { createApiError } from "./error";
import { uploadHeadshot } from "./headshot";
import type {ExecPosition, Term, Onboarding, OnboardingData} from "@uwdsc/common/types";

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
  payload: OnboardingData,
  headshotFile: File | null,
  fullName: string,
): Promise<Onboarding> {
  let headshotUrl = payload.headshot_url ?? null;

  if (payload.consent_website) {
    if (!headshotFile) {
      throw new Error("Headshot file is required when consent_website is true");
    }

    const uploadResult = await uploadHeadshot(headshotFile, fullName);
    headshotUrl = uploadResult.url;
  } else {
    headshotUrl = null;
  }

  const submissionPayload: OnboardingData = {
    ...payload,
    headshot_url: headshotUrl,
  };

  const response = await fetch("/api/onboarding/submission", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(submissionPayload),
  });
  const data = await response.json();
  console.log("API response:", response.status, data);
  if (!response.ok) throw createApiError(data, response.status);
  return data;
}
