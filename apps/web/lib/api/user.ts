/**
 * User API Functions
 *
 * This file contains all user-related API calls.
 * Components should use these functions instead of making direct fetch calls.
 */

import type {
  UserProfile,
  GetProfileResponse,
  UpdateProfileRequest,
  UpdateProfileResponse,
} from "@/types/api";
import { createApiError } from "./errors";

// ============================================================================
// User Profile API Functions
// ============================================================================

/**
 * Get the current user's profile
 *
 * @returns Promise with user profile data (null if not authenticated)
 */
export async function getUserProfile(): Promise<UserProfile | null> {
  const response = await fetch("/api/profile");

  // For 401/404 on profile endpoint, return null profile instead of throwing
  if (response.status === 401 || response.status === 404) {
    return null;
  }

  const data: GetProfileResponse = await response.json();

  if (!response.ok) {
    throw createApiError(data, response.status);
  }

  return data.profile;
}

/**
 * Update the current user's profile
 *
 * @param profileData - Profile fields to update
 * @returns Promise with updated profile data
 * @throws Error if update fails
 */
export async function updateUserProfile(
  profileData: UpdateProfileRequest
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
