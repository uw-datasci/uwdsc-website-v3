import type { ApplicationReviewStatus, InPersonNextTermStatus } from "@uwdsc/common/types";

export interface ReturningExecRow {
  id: string;
  profile_id: string;
  term_id: string;
  email: string;
  full_name: string;
  discord: string;
  past_positions: string;
  interested_in_returning: boolean;
  interested_in_future_term: string | null;
  not_returning_reason: string | null;
  in_person_next_term: InPersonNextTermStatus | null;
  qualifications: string;
  additional_notes: string | null;
  submitted_at: string;
  created_at: string;
  updated_at: string;
}

export interface SelectionRow {
  id: string;
  submission_id: string;
  position_id: number;
  priority: number;
  status: ApplicationReviewStatus;
  position_name: string;
  is_vp: boolean;
  subteam_name: string | null;
}
