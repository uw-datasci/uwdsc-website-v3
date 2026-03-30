/**
 * Applications API Functions
 *
 * Client-side API calls for the applications admin portal.
 */

import { createApiError } from "./error";
import type {
  ApplicationListItem,
  ApplicationReviewStatus,
} from "@uwdsc/common/types";

export interface ApplicationsListResponse {
  applications: ApplicationListItem[];
  statusCounts: {
    draft: number;
    submitted: number;
  };
}

/**
 * Get all non-draft applications with full details plus draft/submitted counts (all rows).
 *
 * @throws Error if request fails or unauthorized
 */
export async function getAllApplications(): Promise<ApplicationsListResponse> {
  const response = await fetch("/api/applications");

  const data = await response.json();

  if (!response.ok) throw createApiError(data, response.status);

  return data as ApplicationsListResponse;
}

interface ReviewApplicationsResponse {
  applications: ApplicationListItem[];
  scope: {
    isPresident: boolean;
    vpSubteamNames: string[];
  };
}

export async function getReviewApplications(): Promise<ReviewApplicationsResponse> {
  const response = await fetch("/api/applications/review");
  const data = await response.json();

  if (!response.ok) throw createApiError(data, response.status);

  return data;
}

export async function updateApplicationReviewStatus(
  applicationId: string,
  status: ApplicationReviewStatus,
): Promise<void> {
  const response = await fetch(`/api/applications/review/${applicationId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    const data = await response.json();
    throw createApiError(data, response.status);
  }
}
