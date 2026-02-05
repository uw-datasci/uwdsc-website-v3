/**
 * Authentication API Functions
 *
 * This file contains all authentication-related API calls.
 * Components should use these functions instead of making direct fetch calls.
 */

import { SignInRequest, SignInResponse } from "@/types/api";
import { createApiError } from "./error";

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
export async function signIn(
  credentials: SignInRequest,
): Promise<SignInResponse> {
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
