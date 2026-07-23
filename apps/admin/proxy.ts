import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createSupabaseMiddlewareClient } from "@uwdsc/db";
import { isProfileCompleteForMiddleware } from "@uwdsc/db/supabase/profile";
import {
  ADMIN_ROLES,
  ALUM_ROLE,
  RETURNING_EXEC_PATH,
  WEB_COMPLETE_PROFILE_PATH,
} from "@uwdsc/common/constants";

const LOGIN_ROUTE = "/login";
const UNAUTHORIZED_ROUTE = "/unauthorized";

function webCompleteProfileAbsoluteUrl(): string {
  const base = process.env.NEXT_PUBLIC_APP_URL || "https://uwdatascience.ca/";
  return new URL(WEB_COMPLETE_PROFILE_PATH, base).toString();
}

/**
 * Proxy to protect all admin routes.
 * - Not signed in: only /login and /api are allowed; other paths redirect to /login.
 * - Signed in (admin/exec/pres): all paths allowed except /login (redirect to /members).
 * - Signed in (alum): only /logistics/returning (the returning-exec form) and /unauthorized are
 *   allowed; everything else — including /login — redirects toward the returning-exec form or
 *   /unauthorized. Alums otherwise have no admin-app access.
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

  const role = user?.app_metadata.role as string | undefined;
  const isAdmin = ADMIN_ROLES.has(role ?? "");
  const isAlum = role === ALUM_ROLE;
  const isLoginRoute = pathname == LOGIN_ROUTE;
  const isUnauthorizedRoute = pathname == UNAUTHORIZED_ROUTE;
  const isReturningExecRoute = pathname === RETURNING_EXEC_PATH;
  const alumAllowedRoute = isUnauthorizedRoute || isReturningExecRoute;

  switch (true) {
    case !user && !isLoginRoute:
      return NextResponse.redirect(new URL("/login", request.url));
    case user && isLoginRoute:
      return NextResponse.redirect(
        new URL(isAlum ? RETURNING_EXEC_PATH : "/members", request.url),
      );
    case user && isAlum && !alumAllowedRoute:
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    case user && !isAdmin && !isAlum && !isUnauthorizedRoute:
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
