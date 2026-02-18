/**
 * Authentication API Functions
 *
 * This file contains all authentication-related API calls.
 * Components should use these functions instead of making direct fetch calls.
 */

import { createApiError } from "./error";
import { LoginData, Profile } from "@uwdsc/common/types";
import { Session, User } from "@supabase/supabase-js";

interface LoginResponse {
  success: boolean;
  user?: User;
  session?: Session;
  error?: string;
}

// ============================================================================
// Authentication API Functions
// ============================================================================

/**
 * Sign in with email and password
 *
 * @param credentials - User email and password
 * @returns Promise with sign in response containing session and user data
 * @throws Error if sign in fails
 */
export async function signIn(credentials: LoginData): Promise<LoginResponse> {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  const data = await response.json();

  if (!response.ok) {
    throw createApiError(data, response.status);
  }

  return data;
}

/**
 * Sign out the current user
 *
 * @returns Promise with signout response
 * @throws Error if signout fails
 */
export async function signOut(): Promise<{ message: string }> {
  const response = await fetch("/api/auth/signout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });

  const data = await response.json();

  if (!response.ok) {
    throw createApiError(data, response.status);
  }

  return data;
}

/**
 * Get the currently authenticated user
 *
 * @returns Promise with user data
 * @throws Error if fetching user fails
 */
export async function getCurrentUser(): Promise<Profile | null> {
  const response = await fetch("/api/auth/user", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  const data = await response.json();

  if (!response.ok) throw createApiError(data, response.status);

  return data.user;
}
