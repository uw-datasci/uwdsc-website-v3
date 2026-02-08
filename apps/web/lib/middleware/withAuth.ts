import { NextResponse, type NextRequest } from "next/server";
import { User } from "@supabase/supabase-js";

/**
 * Middleware to redirect authenticated users away from auth pages
 * Redirects authenticated users to home page
 */
export function withAuth(
  request: NextRequest,
  response: NextResponse,
  user: User | null,
) {
  // If user is authenticated and trying to access auth pages, redirect to home
  if (user) return NextResponse.redirect(new URL("/", request.url));

  // Either not an auth route or user is not authenticated
  return response;
}
