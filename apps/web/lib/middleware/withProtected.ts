import { NextResponse, type NextRequest } from "next/server";

/**
 * Middleware to redirect anonymous users away from protected pages
 * Redirects anonymous users to login page
 */
export function withProtected(
  request: NextRequest,
  response: NextResponse,
  userId: string | undefined,
) {
  if (!userId) return NextResponse.redirect(new URL("/login", request.url));

  return response;
}
