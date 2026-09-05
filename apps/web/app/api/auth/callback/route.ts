import { NextResponse } from "next/server";
import { withRaftRoute } from "@uwdsc/core/http";
import { createAuthService } from "@/lib/services";

/**
 * Auth callback handles two flows:
 * - PKCE (initial signup): Supabase redirects with ?code=... → exchangeCodeForSession(code)
 * - Implicit (resend verification): auth.resend() does not use PKCE; Supabase may redirect
 *   with ?token_hash=...&type=... → verifyOtp({ token_hash, type })
 *
 * Password recovery is intentionally NOT handled here - recovery links go directly
 * to a client-side buffer page so enterprise email scanners can't consume the
 * single-use token before the user opens the email.
 */
export const GET = withRaftRoute(async (request) => {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const token_hash = requestUrl.searchParams.get("token_hash");
  const type = requestUrl.searchParams.get("type");
  const next = requestUrl.searchParams.get("next") ?? "/complete-profile";

  const authService = await createAuthService();
  const redirectToLoginError = (error: string) => {
    const url = new URL(`/login?error=${encodeURIComponent(error)}`, requestUrl.origin);
    return NextResponse.redirect(url);
  };

  let error: string | null = null;

  if (code) {
    error = (await authService.exchangeCodeForSession(code)).error;
    if (error) console.error("Error exchanging code for session:", error);
  } else if (token_hash && type && (type === "signup" || type === "email")) {
    error = (await authService.verifyOtp({ token_hash, type })).error;
    if (error) console.error("Error verifying OTP:", error);
  } else {
    return redirectToLoginError("Missing verification code or token");
  }

  if (error) return redirectToLoginError(error);

  return NextResponse.redirect(new URL(next, requestUrl.origin));
});
