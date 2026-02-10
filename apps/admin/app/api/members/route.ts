import { NextResponse } from "next/server";
import { profileService } from "@uwdsc/core";
import { tryGetCurrentUser } from "@/lib/api/utils";

/**
 * GET /api/members
 * Get all user profiles with membership statistics
 * Admin only endpoint
 */
export async function GET(request: Request) {
  try {
    // Verify admin access
    const { isUnauthorized } = await tryGetCurrentUser();
    if (isUnauthorized) return isUnauthorized;

    // TODO: Add proper admin role check here
    // For now, any authenticated user can access
    // In production, you should verify the user has an admin role

    // Get query parameter to determine what data to return
    const { searchParams } = new URL(request.url);
    const statsOnly = searchParams.get("stats") === "true";

    if (statsOnly) {
      // Return only statistics
      const stats = await profileService.getMembershipStats();
      return NextResponse.json({ stats }, { status: 200 });
    }

    // Return all profiles
    const profiles = await profileService.getAllProfiles();
    return NextResponse.json({ profiles }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching memberships:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error.message || "Failed to fetch membership data",
      },
      { status: 500 },
    );
  }
}
