import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createSupabaseMiddlewareClient } from "@uwdsc/db";
import {
  isProfileComplete,
  withAuth,
  withAnon,
  withProtected,
} from "./lib/middleware";

const AUTH_ROUTES = new Set(["/login", "/register"]);
const PROTECTED_ROUTES = new Set(["/events"]);
const COMPLETE_PROFILE_ROUTE = "/complete-profile";

export async function proxy(request: NextRequest) {
  const response = NextResponse.next({ request: { headers: request.headers } });

  // Get user session
  const supabase = createSupabaseMiddlewareClient(request, response);
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { pathname } = request.nextUrl;

  const isComplete = await isProfileComplete(supabase, user?.id);
  const completeProfileResponse = NextResponse.redirect(
    new URL(COMPLETE_PROFILE_ROUTE, request.url),
  );

  switch (true) {
    // 1. User is not authenticated and trying to access auth routes
    case AUTH_ROUTES.has(pathname):
      return withAuth(request, response, user);
    // 2. Redirect anonymous users from protected pages to login page
    case PROTECTED_ROUTES.has(pathname):
      return withProtected(request, response, user);
    // 3. complete profile route
    case pathname === COMPLETE_PROFILE_ROUTE:
      return await withAnon(request, response, isComplete, user?.id);
    case user && !isComplete:
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
