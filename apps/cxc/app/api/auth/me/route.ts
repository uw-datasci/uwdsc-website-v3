import { ProfileService } from "@uwdsc/server/cxc/services/profileService";
import { createAuthService } from "@/lib/services";
import { NextRequest, NextResponse } from "next/server";

// Handle GET requests - get current user and profile
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const authService = await createAuthService();
    const profileService = new ProfileService();

    // Get the authenticated user
    const userResult = await authService.getCurrentUser();

    if (!userResult.success || !userResult.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Get the user's profile
    const profile = await profileService.getProfileByUserId(userResult.user.id);

    return NextResponse.json({
      user: {
        id: userResult.user.id,
        email: userResult.user.email,
      },
      profile: profile || null,
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
    return NextResponse.json(
      { error: "Failed to fetch user data" },
      { status: 500 }
    );
  }
}
