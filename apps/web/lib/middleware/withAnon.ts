import { NextResponse, type NextRequest } from "next/server";
import { isProfileComplete } from "./utils";
import { SupabaseClient } from "@supabase/supabase-js";

/**
 * Middleware to redirect anonymous users to login page
 */
export async function withAnon(
  request: NextRequest,
  response: NextResponse,
  supabase: SupabaseClient,
  userId: string | undefined,
) {
  // 1. User is not authenticated
  if (!userId) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 2. User is authenticated and profile is complete
  if (await isProfileComplete(supabase, userId)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 3. User is authenticated and profile is incomplete
  return response;
}
