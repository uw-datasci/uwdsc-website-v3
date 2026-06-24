import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createSupabaseMiddlewareClient } from "@uwdsc/db";
import { WEB_COMPLETE_PROFILE_PATH } from "@uwdsc/common/constants";
import { isProfileComplete, withAuth, withAnon, withProtected } from "./lib/middleware";

const AUTH_ROUTES = new Set(["/login", "/register"]);
const PROTECTED_ROUTES = new Set(["/events", "/passport"]);

export async function proxy(request: NextRequest) {
  const response = NextResponse.next({ request: { headers: request.headers } });

  // Validate session via JWT claims (local JWKS verify) instead of getUser(),
  // which hits the Auth API on every request and quickly triggers 429 rate limits.
  const supabase = createSupabaseMiddlewareClient(request, response);
  const { data: claimsData } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;
  const { pathname } = request.nextUrl;

  const isComplete = await isProfileComplete(supabase, userId);
  const completeProfileResponse = NextResponse.redirect(
    new URL(WEB_COMPLETE_PROFILE_PATH, request.url),
  );

  switch (true) {
    // 1. User is not authenticated and trying to access auth routes
    case AUTH_ROUTES.has(pathname):
      return withAuth(request, response, userId);
    // 2. Redirect anonymous users from protected pages to login page
    case PROTECTED_ROUTES.has(pathname):
      return withProtected(request, response, userId);
    // 3. complete profile route
    case pathname === WEB_COMPLETE_PROFILE_PATH:
      return await withAnon(request, response, isComplete, userId);
    case userId && !isComplete:
      return completeProfileResponse;
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - logos (logo files)
     * - images (image files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|logos|images).*)",
  ],
};
