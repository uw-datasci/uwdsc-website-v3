/**
 * Authentication API Functions
 *
 * This file contains all authentication-related API calls.
 * Components should use these functions instead of making direct fetch calls.
 */

import { createApiError } from "./errors";
import { LoginData, Profile } from "@uwdsc/common/types";
import type { LoginResponse } from "@/types/auth";

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
 * Send a password reset email to the user
 *
 * @param email - Email address to send the reset link to
 * @returns Promise with success message
 * @throws Error if request fails
 */
export async function forgotPassword(email: string): Promise<{ message: string }> {
  const response = await fetch("/api/auth/forgot-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  const data = await response.json();

  if (!response.ok) throw createApiError(data, response.status);

  return data;
}

/**
 * Exchange a password-reset email `token_hash` for a recovery session (sets auth cookies).
 *
 * @param token_hash - From the reset link query string
 * @throws Error if verification fails
 */
export async function verifyPasswordRecovery(token_hash: string): Promise<{
  success: boolean;
  message: string;
}> {
  const response = await fetch("/api/auth/verify-recovery", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token_hash }),
  });

  const data = await response.json();

  if (!response.ok) throw createApiError(data, response.status);

  return data;
}

/**
 * Set a new password for the currently authenticated (recovery) session
 *
 * @param password - The new password
 * @returns Promise with success message
 * @throws Error if request fails
 */
export async function resetPassword(password: string): Promise<{ message: string }> {
  const response = await fetch("/api/auth/reset-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
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

  if (data === null) return null;

  return data as Profile;
}
