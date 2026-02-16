/* eslint-disable @typescript-eslint/no-explicit-any */
import { createServerClient, createBrowserClient } from "@supabase/ssr";
import type { CookieOptions } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";

/**
 * Create a Supabase client for browser/client-side operations
 */
export function createSupabaseBrowserClient() {
  return createBrowserClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
  );
}

/**
 * Create a Supabase client for server-side operations with cookie handling
 * This is a factory function that accepts cookie handlers from the framework
 */
export function createSupabaseServerClient(cookieStore: {
  getAll: () => { name: string; value: string }[];
  set: (name: string, value: string, options?: CookieOptions) => void;
}) {
  return createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            for (const { name, value, options } of cookiesToSet) {
              cookieStore.set(name, value, options);
            }
          } catch {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    },
  );
}

/**
 * Create a Supabase client for middleware operations
 * Accepts request and response objects for cookie handling
 */
export function createSupabaseMiddlewareClient<
  NextRequest = any,
  NextResponse = any,
>(
  request: NextRequest & {
    cookies: {
      getAll: () => { name: string; value: string }[];
      set: (params: {
        name: string;
        value: string;
        [key: string]: any;
      }) => void;
    };
  },
  response: NextResponse & {
    cookies: {
      set: (params: {
        name: string;
        value: string;
        [key: string]: any;
      }) => void;
    };
  },
) {
  return createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          for (const { name, value, options } of cookiesToSet) {
            request.cookies.set({ name, value, ...options });
            response.cookies.set({
              name,
              value,
              ...options,
            });
          }
        },
      },
    },
  );
}

/**
 * Create a Supabase client with service role key (bypasses RLS)
 * WARNING: Only use this for admin operations that need to bypass RLS policies
 * This client has full access to all data and should be used with extreme caution
 */
export function createSupabaseServiceRoleClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceRoleKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY environment variable is not set. " +
      "This is required for admin operations that bypass RLS.",
    );
  }

  return createClient(process.env.SUPABASE_URL!, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
