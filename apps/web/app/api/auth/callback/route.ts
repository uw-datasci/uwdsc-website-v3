import { NextRequest, NextResponse } from "next/server";
import { createAuthService } from "@/lib/services";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") ?? "/complete-profile";

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
  }

  // Redirect to the next page after successful authentication
  return NextResponse.redirect(new URL(next, requestUrl.origin));
}
