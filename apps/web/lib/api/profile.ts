/**
 * User API Functions
 *
 * This file contains all user-related API calls.
 * Components should use these functions instead of making direct fetch calls.
 */

import { createApiError } from "./errors";
import {
  Profile,
  ProfileUpdateData,
  CompleteProfileData,
  MembershipStatus,
} from "@uwdsc/common/types";

/** Payload for completing profile (after email verification). Server sets is_math_soc_member from faculty. */
export type CompleteProfilePayload = Omit<
  CompleteProfileData,
  "is_math_soc_member"
>;

/**
 * Get the current user's profile
 *
 * @returns Promise with the user's profile
 * @throws Error if not authenticated or request fails
 */
export async function getProfile(): Promise<Profile> {
  const response = await fetch("/api/profile");
  const data = await response.json();

  if (!response.ok) throw createApiError(data, response.status);

  const { profile } = data as { profile: Profile; isComplete?: boolean };
  return profile;
}

/**
 * Update the current user's profile (settings/dashboard). Uses PATCH.
 *
 * @param profileData - Profile fields to update (first_name, last_name, wat_iam, faculty, term)
 * @returns Promise with success result
 * @throws Error if update fails
 */
export async function updateUserProfile(
  profileData: ProfileUpdateData,
): Promise<{ success: boolean }> {
  const response = await fetch("/api/profile", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(profileData),
  });
  const data = await response.json();
  if (!response.ok) throw createApiError(data, response.status);
  return data;
}

/**
 * Complete the user's profile (post-verification flow). Uses PUT. Sends all required fields including heard_from_where.
 *
 * @param profileData - Full profile completion data
 * @returns Promise with success result
 * @throws Error if update fails
 */
export async function completeProfile(
  profileData: CompleteProfilePayload,
): Promise<{ success: boolean }> {
  const response = await fetch("/api/profile", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(profileData),
  });
  const data = await response.json();
  if (!response.ok) throw createApiError(data, response.status);
  return data;
}

/**
 * Get the user's membership status
 *
 * @returns Promise with membership status
 * @throws Error if fetch fails
 */
export async function getMembershipStatus(): Promise<MembershipStatus> {
  const response = await fetch("/api/profile/membership");
  const data = await response.json();

  if (!response.ok) throw createApiError(data, response.status);

  return data;
}
