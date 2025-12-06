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
 * Get the current logged-in user information
 *
 * @returns Promise with user data (null if not authenticated)
 */

export async function getCurrentUser() {
  const response = await fetch("/api/applications/currentuser");

  // For 401/404 on profile endpoint, return null profile instead of throwing
  if (response.status === 401 || response.status === 404) return null;
  const data = await response.json();
  if (!response.ok) {
    throw createApiError(data, response.status);
  }
  return data.user;
}
