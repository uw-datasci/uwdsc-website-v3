import type { Faculty, UserRole } from "../shared/enums";

// ==========================================
//  Profile Types
//  Used for in web and admin packages
// ==========================================

export interface Profile {
  first_name: string | null;
  last_name: string | null;
  email: string;
  wat_iam: string | null;
  faculty: Faculty | null;
  term: string | null;
  is_math_soc_member: boolean;
  role: UserRole;
}

export interface CompleteProfileData {
  first_name: string;
  last_name: string;
  wat_iam: string;
  faculty: string;
  term: string;
  heard_from_where: string;
  is_math_soc_member: boolean;
}

export type ProfileUpdateData = Omit<
  CompleteProfileData,
  "is_math_soc_member" | "heard_from_where"
>;
