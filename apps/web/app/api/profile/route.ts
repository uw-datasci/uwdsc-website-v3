import { createAuthService } from "@/lib/services";
import { ProfileService } from "@uwdsc/server/web/services/profileService";
import { NextRequest, NextResponse } from "next/server";

// Initialize the service
const profileService = new ProfileService();

// Handle GET requests - get user profile
export async function GET(request: NextRequest) {
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

    // Check if profile is complete
    const isComplete = await profileService.isProfileComplete(user.id);

    return NextResponse.json({
      profile,
      isComplete,
      user: {
        id: user.id,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

// Handle PATCH requests - update user profile
export async function PATCH(request: NextRequest) {
  try {
    const authService = await createAuthService();
    const { user, error } = await authService.getCurrentUser();

    if (error || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the request body
    const body = await request.json();

    // Validate required fields
    const requiredFields = [
      "first_name",
      "last_name",
      "faculty",
      "term",
      "heard_from_where",
    ];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Update the profile
    const result = await profileService.updateProfile(user.id, {
      first_name: body.first_name,
      last_name: body.last_name,
      wat_iam: body.wat_iam,
      faculty: body.faculty,
      term: body.term,
      heard_from_where: body.heard_from_where,
      member_ideas: body.member_ideas,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Failed to update profile" },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
