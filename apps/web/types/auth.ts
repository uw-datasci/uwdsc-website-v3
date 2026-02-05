import { UserMetadata } from "@supabase/supabase-js";

export interface RegisterData {
  email: string;
  password: string;
  metadata?: Record<string, UserMetadata>;
}

export interface ResendVerificationData {
  email: string;
}

export interface LoginData {
  email: string;
  password: string;
}
