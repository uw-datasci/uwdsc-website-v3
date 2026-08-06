/**
 * User API Functions
 *
 * This file contains all user-related API calls.
 * Components should use these functions instead of making direct fetch calls.
 */

import type {
  EditMemberFormValues,
  InviteMemberFormValues,
} from "@/lib/schemas/membership";
import { createApiError } from "./error";
import {
  Member,
  MembershipStats,
  MembershipStatus,
  UserRole,
} from "@uwdsc/common/types";

/**
 * Get all user profiles
 *
 * @param options - Optional query parameters
 * @returns Promise with array of all member profiles
 * @throws Error if request fails or unauthorized
 */
export async function getAllProfiles(options?: {
  paidOnly?: boolean;
  searchQuery?: string;
}): Promise<Member[]> {
  const params = new URLSearchParams();
  if (options?.paidOnly) params.append("paid", "true");
  if (options?.searchQuery) params.append("search", options.searchQuery);

  const queryString = params.toString();
  const url = queryString ? `/api/members?${queryString}` : "/api/members";
  const response = await fetch(url);

  const data = await response.json();

  if (!response.ok) {
    throw createApiError(data, response.status);
  }

  return data;
}

/**
 * Get membership statistics
 *
 * @returns Promise with membership statistics
 * @throws Error if request fails or unauthorized
 */
export async function getMembershipStats(): Promise<MembershipStats> {
  const response = await fetch("/api/members?stats=true");

  const data = await response.json();

  if (!response.ok) {
    throw createApiError(data, response.status);
  }

  return data.stats;
}

/**
 * Invite a new member by email (Supabase sends invite link to the public app).
 */
export async function inviteMember(payload: InviteMemberFormValues): Promise<{
  success: boolean;
  userId: string;
  message: string;
}> {
  const response = await fetch("/api/members", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
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

/**
 * Mark a member as paid, optionally checking them into an active event.
 * @param memberId - The profile ID of the member
 * @param paymentData - Payment method, location, verifier, and optional event_id
 * @returns Whether the member was also checked in, plus any check-in error
 * @throws Error if marking paid fails or the request is unauthorized
 */
export async function markMemberAsPaid(
  memberId: string,
  paymentData: {
    payment_method: "cash" | "online" | "math_soc";
    payment_location: string;
    verifier: string;
    event_id?: string;
  },
): Promise<{ checked_in: boolean; check_in_error?: string }> {
  const response = await fetch(`/api/members/${memberId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(paymentData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw createApiError(data, response.status);
  }

  return {
    checked_in: Boolean(data?.checked_in),
    check_in_error: data?.check_in_error,
  };
}

/**
 * Update member information
 *
 * @param memberId - The profile ID of the member
 * @param memberData - Member fields to update
 * @returns Promise indicating success
 * @throws Error if request fails or unauthorized
 */
export async function updateMember(
  memberId: string,
  memberData: EditMemberFormValues,
): Promise<void> {
  const response = await fetch(`/api/members/${memberId}`, {
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
 * Update a member's role (president-only).
 *
 * @param memberId - The profile ID of the member
 * @param role - The new role to assign
 * @returns Promise indicating success
 * @throws Error if request fails or unauthorized
 */
export async function updateMemberRole(
  memberId: string,
  role: UserRole,
): Promise<void> {
  const response = await fetch(`/api/members/${memberId}/role`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ role }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw createApiError(data, response.status);
  }
}

/**
 * Delete a member
 *
 * @param memberId - The profile ID of the member to delete
 * @returns Promise indicating success
 * @throws Error if request fails or unauthorized
 */
export async function deleteMember(memberId: string): Promise<void> {
  const response = await fetch(`/api/members/${memberId}`, {
    method: "DELETE",
  });

  const data = await response.json();

  if (!response.ok) {
    throw createApiError(data, response.status);
  }
}
