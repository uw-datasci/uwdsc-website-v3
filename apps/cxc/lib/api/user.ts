/**
 * User API Functions
 *
 * This file contains all user-related API calls.
 * Components should use these functions instead of making direct fetch calls.
 */

import type { UserProfile } from "@/types/api";
import { createApiError } from "./errors";

// ============================================================================
// User Profile API Functions
// ============================================================================

/**
 * Get the current user's profile
 *
 * @returns Promise with flattened user and profile data (null if not authenticated)
 */
export async function getUserProfile(): Promise<UserProfile | null> {
  const response = await fetch("/api/profile");

  // For 401/404 on profile endpoint, return null profile instead of throwing
  if (response.status === 401 || response.status === 404) return null;

  const data: UserProfile = await response.json();

  if (!response.ok) throw createApiError(data, response.status);

  return data;
}

/**
 * Update the current user's role for RSVP purposes
 *
 * @param role - The role to assign (hacker, declined, or default)
 * @returns Promise with success response
 * @throws Error if update fails
 */
export async function updateUserRSVPRole(
  role: "hacker" | "declined" | "default",
): Promise<{ success: boolean; message: string }> {
  const response = await fetch("/api/users/role", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ role }),
  });

  const data = await response.json();

  if (!response.ok) throw createApiError(data, response.status);

  return data;
}
