import { NextRequest, NextResponse } from "next/server";
import { createAuthService } from "@/lib/services";
import { ProfileService } from "@uwdsc/server/cxc/services/profileService";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { email, password, metadata } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 },
      );
    }

    const authService = await createAuthService();
    const result = await authService.register(
      { email, password },
      "",
      metadata,
    );

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    // Create profile with NFC ID if user was created
    if (result.user?.id) {
      try {
        const profileService = new ProfileService();
        const profileResult = await profileService.createProfile(result.user.id);
        
        if (!profileResult.success) {
          console.error("Failed to create profile:", profileResult.error);
          // Don't fail registration if profile creation fails, but log it
          // The profile might already exist or be created by a trigger
        }
      } catch (profileError) {
        console.error("Error creating profile during registration:", profileError);
        // Don't fail registration if profile creation fails
      }
    }

    return NextResponse.json({
      success: true,
      user: result.user,
      session: result.session,
      needsEmailConfirmation: result.needsEmailConfirmation,
      message: result.message,
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 },
    );
  }
}
