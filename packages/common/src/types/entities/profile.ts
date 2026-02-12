import type { Faculty, PaymentMethod, UserRole } from "../shared/enums";

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
  user_role: UserRole;
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

// ==========================================
//  ADMIN Types
//  Used for in admin package
// ==========================================

export type UpdateMemberData = Partial<
  Omit<CompleteProfileData, "heard_from_where">
>;

export interface Member {
  first_name: string | null;
  last_name: string | null;
  email: string;
  wat_iam: string | null;
  faculty: Faculty | null;
  term: string | null;
  is_math_soc_member: boolean;
  user_role: UserRole;
  has_paid: boolean;
  payment_method: PaymentMethod | null;
  payment_location: string | null;
  verifier: string | null;
}

export interface MembershipStats {
  total_users: number;
  paid_users: number;
  math_soc_members: number;
}
