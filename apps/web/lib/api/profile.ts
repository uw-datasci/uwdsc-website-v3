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
  GetAllProfilesResponse,
  MemberProfile,
  GetMembershipStatsResponse,
  MembershipStats,
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

  if (!response.ok) {
    throw createApiError(data, response.status);
  }

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

// ============================================================================
// Admin API Functions
// ============================================================================

/**
 * Get all user profiles (admin only)
 *
 * @returns Promise with array of all member profiles
 * @throws Error if request fails or unauthorized
 */
export async function getAllProfiles(): Promise<MemberProfile[]> {
  const response = await fetch("/api/admin/memberships");

  const data: GetAllProfilesResponse = await response.json();

  if (!response.ok) {
    throw createApiError(data, response.status);
  }

  return data.profiles;
}

/**
 * Get membership statistics (admin only)
 *
 * @returns Promise with membership statistics
 * @throws Error if request fails or unauthorized
 */
export async function getMembershipStats(): Promise<MembershipStats> {
  const response = await fetch("/api/admin/memberships?stats=true");

  const data: GetMembershipStatsResponse = await response.json();

  if (!response.ok) {
    throw createApiError(data, response.status);
  }

  return data.stats;
}

/**
 * Mark a member as paid (admin only)
 *
 * @param memberId - The profile ID of the member
 * @param paymentData - Payment method, location, and verifier
 * @returns Promise indicating success
 * @throws Error if request fails or unauthorized
 */
export async function markMemberAsPaid(
  memberId: string,
  paymentData: {
    payment_method: "cash" | "online" | "math_soc";
    payment_location: string;
    verifier: string;
  },
): Promise<void> {
  const response = await fetch(`/api/admin/memberships/${memberId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(paymentData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw createApiError(data, response.status);
  }
}

/**
 * Update member information (admin only)
 *
 * @param memberId - The profile ID of the member
 * @param memberData - Member fields to update
 * @returns Promise indicating success
 * @throws Error if request fails or unauthorized
 */
export async function updateMember(
  memberId: string,
  memberData: {
    first_name: string;
    last_name: string;
    wat_iam?: string | null;
    faculty?: string | null;
    term?: string | null;
    is_math_soc_member: boolean;
  },
): Promise<void> {
  const response = await fetch(`/api/admin/memberships/${memberId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(memberData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw createApiError(data, response.status);
  }
}

/**
 * Delete a member (admin only)
 *
 * @param memberId - The profile ID of the member to delete
 * @returns Promise indicating success
 * @throws Error if request fails or unauthorized
 */
export async function deleteMember(memberId: string): Promise<void> {
  const response = await fetch(`/api/admin/memberships/${memberId}`, {
    method: "DELETE",
  });

  const data = await response.json();

  if (!response.ok) {
    throw createApiError(data, response.status);
  }
}
