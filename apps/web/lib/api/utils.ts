import { NextResponse } from "next/server";
import { createAuthService } from "@/lib/services";
import type { User } from "@supabase/supabase-js";
import { ApiResponse } from "@uwdsc/common/utils";
import { BASE_PROFILE_FIELDS } from "@/constants/profile";
import type { ProfileUpdateData } from "@uwdsc/common/types";

// ==========================================
//  Auth Utils
// ==========================================

interface AuthResult {
  user: User | null;
  isUnauthorized: NextResponse | null;
}

/**
 * Gets the current authenticated user or returns an unauthorized response.
 * Use this in API routes to simplify authentication checks.
 *
 * @example
 * ```ts
 * const { user, isUnauthorized } = await tryGetCurrentUser();
 * if (isUnauthorized) return isUnauthorized;
 * // Use user here - it's guaranteed to be non-null
 * ```
 */
export async function tryGetCurrentUser(): Promise<AuthResult> {
  const authService = await createAuthService();
  const { user, error: userError } = await authService.getCurrentUser();

  if (userError || !user) {
    return {
      user: null,
      isUnauthorized: ApiResponse.unauthorized("Authentication required"),
    };
  }

  return {
    user,
    isUnauthorized: null,
  };
}

// ==========================================
//  Profile Utils
// ==========================================

interface ProfileValidationError {
  error: string;
  field: string;
}

/**
 * Validates that body contains all base profile fields and that string/number fields are non-empty.
 * Returns an error object if validation fails, null otherwise.
 */
export function validateBaseProfileFields(
  body: Record<string, unknown>,
): ProfileValidationError | null {
  for (const field of BASE_PROFILE_FIELDS) {
    const value = body[field];
    if (value === undefined || value === null) {
      return { error: `${field} is required`, field };
    }
    let str: string;
    if (typeof value === "string") str = value;
    else if (typeof value === "number") str = String(value);
    else str = "";

    if (str.trim() === "") return { error: `${field} cannot be empty`, field };
  }
  return null;
}

/**
 * Builds a trimmed base profile payload from the request body.
 * Call after validateBaseProfileFields has passed.
 */
export function trimBaseProfilePayload(
  body: Record<string, unknown>,
): ProfileUpdateData {
  return {
    first_name: String(body.first_name).trim(),
    last_name: String(body.last_name).trim(),
    wat_iam: String(body.wat_iam).trim(),
    faculty: String(body.faculty),
    term: String(body.term),
  };
}
