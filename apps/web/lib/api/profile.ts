/**
 * User API Functions
 *
 * This file contains all user-related API calls.
 * Components should use these functions instead of making direct fetch calls.
 */

import type {
  GetProfileResponse,
  UpdateProfileRequest,
  UpdateProfileResponse,
} from "@/types/api";
import { createApiError } from "./errors";

// ============================================================================
// User Profile API Functions
// ============================================================================

/**
 * Get the current user's profile with full response data
 *
 * @returns Promise with full profile response including profile and isComplete
 * @throws Error if not authenticated or request fails
 */
export async function getProfile(): Promise<GetProfileResponse> {
  const response = await fetch("/api/profile");

  const data: GetProfileResponse = await response.json();

  if (!response.ok) throw createApiError(data, response.status);

  return data;
}

/**
 * Update the current user's profile
 *
 * @param profileData - Profile fields to update
 * @returns Promise with updated profile data
 * @throws Error if update fails
 */
export async function updateUserProfile(
  profileData: UpdateProfileRequest,
): Promise<UpdateProfileResponse> {
  const response = await fetch("/api/profile", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(profileData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw createApiError(data, response.status);
  }

  return data;
}
