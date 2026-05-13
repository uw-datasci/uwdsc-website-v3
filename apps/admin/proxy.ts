import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createSupabaseMiddlewareClient } from "@uwdsc/db";
import { isProfileCompleteForMiddleware } from "@uwdsc/db/supabase/profile";
import { ADMIN_ROLES, WEB_COMPLETE_PROFILE_PATH } from "@uwdsc/common/constants";

const LOGIN_ROUTE = "/login";
const UNAUTHORIZED_ROUTE = "/unauthorized";

function webCompleteProfileAbsoluteUrl(): string {
  const base = process.env.NEXT_PUBLIC_APP_URL || "https://uwdatascience.ca/";
  return new URL(WEB_COMPLETE_PROFILE_PATH, base).toString();
}

/**
 * Proxy to protect all admin routes.
 * - Not signed in: only /login and /api are allowed; other paths redirect to /login.
 * - Signed in: all paths allowed except /login (redirect to /members).
 * - Signed-in admins with an incomplete web profile: redirect to the web app complete-profile page.
 */
export async function proxy(request: NextRequest) {
  const response = NextResponse.next({ request: { headers: request.headers } });
  const pathname = request.nextUrl.pathname;

  // Create Supabase client for authentication check
  const supabase = createSupabaseMiddlewareClient(request, response);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAdmin = ADMIN_ROLES.has(user?.app_metadata.role);
  const isLoginRoute = pathname == LOGIN_ROUTE;
  const isUnauthorizedRoute = pathname == UNAUTHORIZED_ROUTE;

  switch (true) {
    case !user && !isLoginRoute:
      return NextResponse.redirect(new URL("/login", request.url));
    case user && isLoginRoute:
      return NextResponse.redirect(new URL("/members", request.url));
    case user && !isAdmin && !isUnauthorizedRoute:
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    case user && isAdmin && isUnauthorizedRoute:
      return NextResponse.redirect(new URL("/members", request.url));
  }

  if (user && isAdmin) {
    const profileComplete = await isProfileCompleteForMiddleware(supabase, user.id);
    if (!profileComplete) {
      return NextResponse.redirect(webCompleteProfileAbsoluteUrl());
    }
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
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
