import { NextRequest, NextResponse } from "next/server";
import { createAuthService } from "@/lib/services";

/**
 * Auth callback handles two flows:
 * - PKCE (initial signup): Supabase redirects with ?code=... → exchangeCodeForSession(code)
 * - Implicit (resend verification): auth.resend() does not use PKCE; Supabase may redirect
 *   with ?token_hash=...&type=... → verifyOtp({ token_hash, type })
 */
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const token_hash = requestUrl.searchParams.get("token_hash");
  const type = requestUrl.searchParams.get("type");
  const next = requestUrl.searchParams.get("next") ?? "/complete-profile";

  const authService = await createAuthService();

  if (code) {
    const { error } = await authService.exchangeCodeForSession(code);
    if (error) {
      console.error("Error exchanging code for session:", error);
      return NextResponse.redirect(
        new URL(`/login?error=${encodeURIComponent(error)}`, requestUrl.origin),
      );
    }
  } else if (token_hash && type && (type === "signup" || type === "email")) {
    const { error } = await authService.verifyOtp({ token_hash, type: type });
    if (error) {
      console.error("Error verifying OTP:", error);
      return NextResponse.redirect(
        new URL(`/login?error=${encodeURIComponent(error)}`, requestUrl.origin),
      );
    }
  } else {
    return NextResponse.redirect(
      new URL(
        "/login?error=" +
          encodeURIComponent("Missing verification code or token"),
        requestUrl.origin,
      ),
    );
  }

  return NextResponse.redirect(new URL(next, requestUrl.origin));
}
