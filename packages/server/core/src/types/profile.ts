type UserRole = "member" | "admin" | "exec";

type Faculty =
  | "math"
  | "engineering"
  | "science"
  | "arts"
  | "health"
  | "environment"
  | "other_non_waterloo";

type PaymentMethod = "cash" | "online" | "math_soc";

export interface MarkAsPaidData {
  payment_method: "cash" | "online" | "math_soc";
  payment_location: string;
  verifier: string;
}

export interface Profile {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  user_role: UserRole;
  has_paid: boolean;
  wat_iam: string | null;
  faculty: Faculty | null;
  term: string | null;
  heard_from_where: string | null;
  payment_method: PaymentMethod | null;
  payment_location: string | null;
  verifier: string | null;
  member_ideas: string | null;
  is_math_soc_member: boolean;
}

export interface ProfileUpdateData {
  first_name: string;
  last_name: string;
  wat_iam?: string;
  faculty: string;
  term: string;
  heard_from_where: string;
  member_ideas?: string;
}

export interface UpdateMemberData {
  first_name: string;
  last_name: string;
  wat_iam?: string | null;
  faculty?: string | null;
  term?: string | null;
  is_math_soc_member: boolean;
}
