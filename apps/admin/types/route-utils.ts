import type { NextResponse } from "next/server";
import type { User } from "@supabase/supabase-js";

export interface AuthResult {
  user: User | null;
  isUnauthorized: NextResponse | null;
}
