import { createAuthService } from "@/lib/services";
import {
  tryGetCurrentUser,
  validateBaseProfileFields,
  trimBaseProfilePayload,
} from "@/lib/api/utils";
import { profileService } from "@uwdsc/core";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const { user, isUnauthorized } = await tryGetCurrentUser();
    if (isUnauthorized || !user) return isUnauthorized;

    const profile = await profileService.getProfileByUserId(user.id);
    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const isComplete = await profileService.isProfileComplete(user.id);
    return NextResponse.json({ profile, isComplete });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 },
    );
  }
}

// PUT - complete profile (post-verification); requires heard_from_where
export async function PUT(request: NextRequest) {
  try {
    const authService = await createAuthService();
    const { user, error } = await authService.getCurrentUser();
    if (error || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as Record<string, unknown>;
    const validationError = validateBaseProfileFields(body);
    if (validationError) {
      return NextResponse.json(
        { error: validationError.error },
        { status: 400 },
      );
    }

    if (typeof body.heard_from_where !== "string" || !body.heard_from_where.trim()) {
      return NextResponse.json(
        { error: "heard_from_where is required and must be non-empty" },
        { status: 400 },
      );
    }

    const base = trimBaseProfilePayload(body);
    const result = await profileService.completeProfile(user.id, {
      ...base,
      heard_from_where: body.heard_from_where.trim(),
      is_math_soc_member: base.faculty === "math",
    });
    if (!result.success) {
      return NextResponse.json(
        { error: result.error ?? "Failed to complete profile" },
        { status: 400 },
      );
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error completing profile:", error);
    return NextResponse.json(
      { error: "Failed to complete profile" },
      { status: 500 },
    );
  }
}

// PATCH - update profile (e.g. settings/dashboard); no heard_from_where
export async function PATCH(request: NextRequest) {
  try {
    const authService = await createAuthService();
    const { user, error } = await authService.getCurrentUser();
    if (error || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as Record<string, unknown>;
    const validationError = validateBaseProfileFields(body);
    if (validationError) {
      return NextResponse.json(
        { error: validationError.error },
        { status: 400 },
      );
    }

    const base = trimBaseProfilePayload(body);
    const result = await profileService.updateProfile(user.id, base);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error ?? "Failed to update profile" },
        { status: 400 },
      );
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 },
    );
  }
}
