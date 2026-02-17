import { Faculty, PaymentMethod, UserRole } from "../shared/enums";
import { CompleteProfileData } from "./profile";

export interface MarkAsPaidData {
  payment_method: PaymentMethod;
  payment_location: string;
  verifier: string;
}

export type UpdateMemberData = Partial<
  Omit<CompleteProfileData, "heard_from_where">
>;

export interface Member {
  id: string;
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
