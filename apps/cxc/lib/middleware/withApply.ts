/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Middleware to protect the /apply route
 * Blocks ALL users (including admins) from accessing /apply
 * Redirects everyone to home page
 */
export function withApply(request: NextRequest, user: any) {
  // Block everyone, regardless of authentication or role
  return NextResponse.redirect(new URL("/", request.url));
}
