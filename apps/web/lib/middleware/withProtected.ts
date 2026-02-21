import { NextResponse, type NextRequest } from "next/server";
import { User } from "@supabase/supabase-js";

/**
 * Middleware to redirect anonymous users away from protected pages
 * Redirects anonymous users to login page
 */
export function withProtected(
  request: NextRequest,
  response: NextResponse,
  user: User | null,
) {
  if (!user) return NextResponse.redirect(new URL("/login", request.url));

  return response;
}
