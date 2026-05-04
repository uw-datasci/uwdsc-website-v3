import { TermType, UserRole } from "../shared";
// ==========================================
//  Row-level types (1:1 with DB tables)
// ==========================================

/** Mirrors onboarding table */
export interface Onboarding {
  id: string;
  profile_id: string;
  term_id: string;
  email: string;
  role_id: number;
  in_waterloo: string;
  term_type: TermType;
  instagram: string | null;
  headshot_url: string | null;
  consent_website: boolean;
  consent_instagram: boolean;
  discord: string;
  datasci_competency: number;
  anything_else: string | null;
  submitted_at: string;
  created_at: string;
  updated_at: string;
}

export type OnboardingData = Omit<
  Onboarding,
  "id" | "profile_id" | "submitted_at" | "created_at" | "updated_at"
>;

// ==========================================
//  Composite types
// ==========================================

export interface OnboardingAdminRow {
  profile_id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  user_role: UserRole;
  exec_position_id: number | null;
  exec_position_name: string | null;
  submission_role_id: number | null;
  submission_role_name: string | null;
  submission: Onboarding | null;
}
