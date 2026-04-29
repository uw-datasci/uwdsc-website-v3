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

export interface PositionReviewScopeDto {
  canUse: boolean;
  isPresident: boolean;
  vpPositionIds: number[];
}

export interface ApplicationsListResponse {
  applications: ApplicationListItem[];
  statusCounts: {
    draft: number;
    submitted: number;
  };
  positionReview: PositionReviewScopeDto;
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

export async function updatePositionSelectionReviewStatus(
  selectionId: string,
  status: ApplicationReviewStatus,
): Promise<void> {
  const response = await fetch(`/api/applications/review/${selectionId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    const data = await response.json();
    throw createApiError(data, response.status);
  }
}
