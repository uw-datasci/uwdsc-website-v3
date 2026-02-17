/**
 * User API Functions
 *
 * This file contains all user-related API calls.
 * Components should use these functions instead of making direct fetch calls.
 */

import type { EditMemberFormValues } from "@/lib/schemas/membership";
import { createApiError } from "./error";
import { Member, MembershipStats } from "@uwdsc/common/types";

/**
 * Get all user profiles
 *
 * @returns Promise with array of all member profiles
 * @throws Error if request fails or unauthorized
 */
export async function getAllProfiles(): Promise<Member[]> {
  const response = await fetch("/api/members");

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
 * Mark a member as paid
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
  const response = await fetch(`/api/members/${memberId}`, {
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
