import {
  tryGetCurrentUser,
  validateBaseProfileFields,
  trimBaseProfilePayload,
} from "@/lib/api/utils";
import { profileService } from "@uwdsc/core";
import { ApiResponse } from "@uwdsc/common/utils";
import { NextRequest } from "next/server";

export async function GET() {
  try {
    const { user, isUnauthorized } = await tryGetCurrentUser();
    if (isUnauthorized || !user) return isUnauthorized;

    const profile = await profileService.getProfileByUserId(user.id);
    if (!profile) return ApiResponse.notFound("Profile not found");

    const isComplete = await profileService.isProfileComplete(user.id);
    return ApiResponse.ok({ profile, isComplete });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return ApiResponse.serverError(error, "Failed to fetch profile");
  }
}

// PUT - complete profile (post-verification); requires heard_from_where
export async function PUT(request: NextRequest) {
  try {
    const { user, isUnauthorized } = await tryGetCurrentUser();
    if (isUnauthorized || !user) return isUnauthorized;

    const body = (await request.json()) as Record<string, unknown>;
    const validationError = validateBaseProfileFields(body);
    if (validationError) return ApiResponse.badRequest(validationError.error);

    if (
      typeof body.heard_from_where !== "string" ||
      !body.heard_from_where.trim()
    ) {
      return ApiResponse.badRequest(
        "heard_from_where is required and must be non-empty",
      );
    }

    const base = trimBaseProfilePayload(body);
    const result = await profileService.completeProfile(user.id, {
      ...base,
      heard_from_where: body.heard_from_where.trim(),
      is_math_soc_member: base.faculty === "math",
    });
    if (!result.success) {
      return ApiResponse.badRequest("Failed to complete profile", result.error);
    }

    return ApiResponse.ok({ success: true });
  } catch (error) {
    console.error("Error completing profile:", error);
    return ApiResponse.serverError(error, "Failed to complete profile");
  }
}

// PATCH - update profile (e.g. settings/dashboard); no heard_from_where
export async function PATCH(request: NextRequest) {
  try {
    const { user, isUnauthorized } = await tryGetCurrentUser();
    if (isUnauthorized || !user) return isUnauthorized;

    const body = (await request.json()) as Record<string, unknown>;
    const validationError = validateBaseProfileFields(body);
    if (validationError) return ApiResponse.badRequest(validationError.error);

    const base = trimBaseProfilePayload(body);
    const result = await profileService.updateProfile(user.id, base);
    if (!result.success) {
      return ApiResponse.badRequest("Failed to update profile", result.error);
    }

    return ApiResponse.ok({ success: true });
  } catch (error) {
    console.error("Error updating profile:", error);
    return ApiResponse.serverError(error, "Failed to update profile");
  }
}
