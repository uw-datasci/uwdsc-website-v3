/**
 * Authentication API Functions
 *
 * This file contains all authentication-related API calls.
 * Components should use these functions instead of making direct fetch calls.
 */

import type {
  RegisterRequest,
  RegisterResponse,
  LoginRequest,
  LoginResponse,
  AuthMeResponse,
  ResendVerificationEmailRequest,
  ResendVerificationEmailResponse,
} from "@/types/api";
import { createApiError } from "./errors";

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
export async function register(
  credentials: RegisterRequest
): Promise<RegisterResponse> {
  const response = await fetch("/api/auth/register", {
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
 * Login with email and password
 *
 * @param credentials - User email and password
 * @returns Promise with login response containing session and user data
 * @throws Error if login fails
 */
export async function login(credentials: LoginRequest): Promise<LoginResponse> {
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
 * Get current authenticated user information
 *
 * @returns Promise with current user and profile data
 * @throws Error if not authenticated or request fails
 */
export async function getAuthMe(): Promise<AuthMeResponse> {
  const response = await fetch("/api/auth/me");

  const data = await response.json();

  if (!response.ok) {
    throw createApiError(data, response.status);
  }

  return data;
}

/**
 * Resend verification email to user
 *
 * @param request - Email address to resend verification to
 * @returns Promise with success message
 * @throws Error if resend fails
 */
export async function resendVerificationEmail(
  request: ResendVerificationEmailRequest
): Promise<ResendVerificationEmailResponse> {
  const response = await fetch("/api/auth/resend-verification-email", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
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
