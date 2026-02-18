/**
 * Authentication API Functions
 *
 * This file contains all authentication-related API calls.
 * Components should use these functions instead of making direct fetch calls.
 */

import { createApiError } from "./errors";
import { LoginData, Profile } from "@uwdsc/common/types";
import { User, Session } from "@supabase/supabase-js";

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
 * Register a new user account
 *
 * @param credentials - User email and password
 * @returns Promise with registration response
 * @throws Error if registration fails
 */
export async function register(credentials: LoginData) {
  const response = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  const data = await response.json();

  if (!response.ok) throw createApiError(data, response.status);

  return data;
}

/**
 * Login with email and password
 *
 * @param credentials - User email and password
 * @returns Promise with login response containing session and user data
 * @throws Error if login fails
 */
export async function login(credentials: LoginData): Promise<LoginResponse> {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  const data = await response.json();

  if (!response.ok) throw createApiError(data, response.status);

  return data;
}

/**
 * Resend verification email to user
 *
 * @param request - Email address to resend verification to
 * @returns Promise with success message
 * @throws Error if resend fails
 */
export async function resendVerificationEmail(request: {
  email: string;
}): Promise<{ message: string }> {
  const response = await fetch("/api/auth/resend-verification-email", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });

  const data = await response.json();

  if (!response.ok) throw createApiError(data, response.status);

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

  if (!response.ok) throw createApiError(data, response.status);

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

  return data;
}
