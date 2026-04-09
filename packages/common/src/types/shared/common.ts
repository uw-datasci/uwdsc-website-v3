// Common shared types
// Utility types used across the application

export interface MembershipStatus {
  has_membership: boolean;
  membership_id: string | null;
}

/** Mirrors exec_positions table (from profiles migration) */
export interface ExecPosition {
  id: string;
  name: string;
}

/** Mirrors terms table */
export interface Term {
  id: string;
  code: string;
  is_active: boolean;
  application_release_date: string;
  application_soft_deadline: string;
  application_hard_deadline: string;
  start_date: string | null;
  onboarding_due_date: string | null;
  created_at: string;
}