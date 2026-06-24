import { NextResponse, type NextRequest } from "next/server";
import { safeRedirect } from "../auth/safeRedirect";

/**
 * Middleware to redirect authenticated users away from auth pages
 * Redirects authenticated users to ?redirect=<url> if provided & trusted,
 * else to the home page.
 */
export function withAuth(
  request: NextRequest,
  response: NextResponse,
  userId: string | undefined,
) {
  if (userId) {
    const target = safeRedirect(request.nextUrl.searchParams.get("redirect"));
    return NextResponse.redirect(
      target.startsWith("/") ? new URL(target, request.url) : new URL(target),
    );
  }

  return response;
}
