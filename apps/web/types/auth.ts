import type { Session, User } from "@supabase/supabase-js";

export interface LoginResponse {
  success: boolean;
  user?: User;
  session?: Session;
  error?: string;
}
