/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ProfileService } from "@uwdsc/server/cxc/services/profileService";

/**
 * Middleware to protect routes that require authentication
 * For /review and /admin routes, checks for admin or superadmin role
 * Redirects unauthenticated users to /login
 * Redirects non-admin/superadmin users trying to access protected routes to home
 * Special: /admin/assign requires superadmin role
 */
export async function withProtected(request: NextRequest, user: any) {
  // If user is not authenticated, redirect to login
  if (!user) return NextResponse.redirect(new URL("/login", request.url));

  // Check admin role for /review and /admin routes
  if (
    request.nextUrl.pathname === "/review" ||
    request.nextUrl.pathname.startsWith("/admin")
  ) {
    try {
      const profileService = new ProfileService();
      const profile = await profileService.getProfileByUserId(user.id);

      // If profile doesn't exist, user can't access admin routes
      if (!profile) {
        console.log(
          `[Middleware] User ${user.id} has no profile, blocking access to ${request.nextUrl.pathname}`,
        );
        return NextResponse.redirect(new URL("/", request.url));
      }

      // Special handling for /admin/assign - requires superadmin
      if (request.nextUrl.pathname === "/admin/assign") {
        if (profile.role !== "superadmin") {
          console.log(
            `[Middleware] User ${user.id} (role: ${profile.role}) attempted to access /admin/assign, requires superadmin`,
          );
          return NextResponse.redirect(new URL("/", request.url));
        }
      } else {
        // Other admin routes require admin or superadmin
        // /admin/assign-volunteers is accessible to both admin and superadmin
        if (profile.role !== "admin" && profile.role !== "superadmin") {
          console.log(
            `[Middleware] User ${user.id} (role: ${profile.role}) attempted to access ${request.nextUrl.pathname}, requires admin or superadmin`,
          );
          return NextResponse.redirect(new URL("/", request.url));
        }
      }
    } catch (error) {
      console.error(
        `[Middleware] Error checking admin role for user ${user.id}:`,
        error,
      );
      // On error, redirect to home for safety
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // User is authenticated and has admin permissions
  return NextResponse.next();
}
