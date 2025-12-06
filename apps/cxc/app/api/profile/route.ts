import { createAuthService } from "@/lib/services";
import { ProfileService } from "@uwdsc/server/cxc/services/profileService";
import { NextResponse } from "next/server";

// Initialize the service
const profileService = new ProfileService();

// Handle GET requests - get user profile
export async function GET() {
  try {
    const authService = await createAuthService();

    // Get the authenticated user
    const { user, error } = await authService.getCurrentUser();

    if (error || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the user's profile
    const profile = await profileService.getProfileByUserId(user.id);

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: user.id,
      email: user.email,
      first_name: user.user_metadata.first_name,
      last_name: user.user_metadata.last_name,
      role: profile.role,
      nfc_id: profile.nfc_id?.toString() ?? null,
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 },
    );
  }
}
