import { tryGetCurrentUser } from "@/lib/api/utils";
import { profileService } from "@uwdsc/core";
import { NextResponse } from "next/server";

/**
 * GET /api/auth/user
 * Get the currently authenticated user
 */
export async function GET() {
  try {
    const { user, isUnauthorized } = await tryGetCurrentUser();

    if (isUnauthorized) return isUnauthorized;

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Extract role from app_metadata
    const role = user.app_metadata?.role ?? null;

    // Fetch profile using user.id
    const profile = await profileService.getProfileByUserId(user.id);

    // Flatten user and profile data into a single object
    return NextResponse.json({
      user: {
        email: user.email,
        role,
        first_name: profile?.first_name,
        last_name: profile?.last_name,
        wat_iam: profile?.wat_iam,
        faculty: profile?.faculty,
      },
    });
  } catch (error) {
    console.error("Error fetching current user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 },
    );
  }
}
