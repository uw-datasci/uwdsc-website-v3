import type { UserRole } from "@uwdsc/common/types";

export interface AcceptedOfferRow {
  profile_id: string;
  full_name: string;
  position_name: string;
  is_vp: boolean;
  subteam_name: string | null;
  email: string | null;
}

export interface OnboardingAdminRowDb {
  profile_id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  user_role: UserRole;
  exec_position_id: number | null;
  exec_position_name: string | null;
  submission_id: string | null;
  submission_term_id: string | null;
  submission_email: string | null;
  submission_role_id: number | null;
  submission_role_name: string | null;
  submission_in_waterloo: string | null;
  submission_term_type: "study" | "coop" | null;
  submission_instagram: string | null;
  submission_headshot_url: string | null;
  submission_consent_website: boolean | null;
  submission_consent_instagram: boolean | null;
  submission_discord: string | null;
  submission_datasci_competency: number | null;
  submission_anything_else: string | null;
  submission_submitted_at: string | null;
  submission_created_at: string | null;
  submission_updated_at: string | null;
}
