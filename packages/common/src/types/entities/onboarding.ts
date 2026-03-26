
// ==========================================
//  Row-level types (1:1 with DB tables)
// ==========================================

/** Mirrors onboarding table */
export interface Onboarding {
  id: string;
  profile_id: string;
  term_id: string;
  email: string;
  role: string;
  in_waterloo: boolean;
  term_type: string;
  instagram: string | null;
  headshot_url: string | null;
  consent_website: boolean;
  consent_instagram: boolean;
  discord: string | null;
  datasci_competency: number | null;
  anything_else: string | null;
  submitted_at: string;
  created_at: string;
  updated_at: string;
}