import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createSupabaseMiddlewareClient } from "@uwdsc/db";

/**
 * Proxy to protect all admin routes.
 * - Not signed in: only /login and /api are allowed; other paths redirect to /login.
 * - Signed in: all paths allowed except /login (redirect to /dashboard).
 */
export async function proxy(request: NextRequest) {
  try {
    const pathname = request.nextUrl.pathname;

    // Always allow API routes (no auth check)
    if (pathname.startsWith("/api")) {
      return NextResponse.next({ request: { headers: request.headers } });
    }

    const response = NextResponse.next({
      request: { headers: request.headers },
    });

    // Create Supabase client for authentication check
    const supabase = createSupabaseMiddlewareClient(request, response);

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    // Not signed in: allow only /login
    if (!user || authError) {
      if (pathname === "/login") return response;
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Signed in: do not allow /login; redirect to dashboard
    if (pathname === "/login") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return response;
  } catch (error) {
    console.error("Proxy error:", error);
    return NextResponse.next({
      request: { headers: request.headers },
    });
  }
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
