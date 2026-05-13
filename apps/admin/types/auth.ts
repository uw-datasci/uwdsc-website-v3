import type { Profile } from "@uwdsc/common/types";
import type { Session, User } from "@supabase/supabase-js";

export type ExecUser = Profile & {
  position_id?: number | null;
  subteam_id?: number | null;
  role?: string | null;
};

export interface LoginResponse {
  success: boolean;
  user?: User;
  session?: Session;
  error?: string;
}
