import { NextRequest, NextResponse } from "next/server";
import { createAuthService } from "@/lib/services";
import { ProfileService } from "@uwdsc/server/cxc/services/profileService";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") ?? "/";

  if (code) {
    const authService = await createAuthService();

    // Exchange the code for a session
    const { error } = await authService.exchangeCodeForSession(code);

    if (error) {
      console.error("Error exchanging code for session:", error);
      return NextResponse.redirect(
        new URL(`/login?error=${encodeURIComponent(error)}`, requestUrl.origin),
      );
    }

    // Ensure profile exists with NFC ID after email verification
    try {
      const { user } = await authService.getCurrentUser();
      if (user?.id) {
        const profileService = new ProfileService();
        // This will create profile with NFC ID if it doesn't exist,
        // or ensure NFC ID is set if profile exists without one
        await profileService.getOrGenerateNfcId(user.id);
      }
    } catch (profileError) {
      console.error("Error ensuring profile has NFC ID:", profileError);
      // Don't fail auth callback if profile creation fails
    }
  }

  // Redirect to the next page after successful authentication
  return NextResponse.redirect(new URL(next, requestUrl.origin));
}
