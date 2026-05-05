import type { ApplicationReviewStatus } from "../shared/enums";

/** Mirrors returning_exec_submissions DB table */
export interface ReturningExecSubmission {
  id: string;
  profile_id: string;
  term_id: string;
  email: string;
  full_name: string;
  discord: string;
  past_positions: string;
  interested_in_returning: boolean;
  not_returning_reason: string | null;
  in_person_next_term: boolean;
  qualifications: string;
  additional_notes: string | null;
  submitted_at: string;
  created_at: string;
  updated_at: string;
}

export type ReturningExecSubmissionData = Omit<
  ReturningExecSubmission,
  "id" | "profile_id" | "submitted_at" | "created_at" | "updated_at"
> & {
  position_selections: {
    position_id: number;
    priority: 1 | 2 | 3;
  }[];
};

/** A selection row joined with position info */
export interface ReturningExecPositionSelection {
  id: string;
  submission_id: string;
  position_id: number;
  priority: number;
  status: ApplicationReviewStatus;
  position_name: string;
  is_vp: boolean;
  subteam_name: string | null;
}

/** Submission + selections returned from the list endpoint */
export interface ReturningExecListItem {
  id: string;
  profile_id: string;
  full_name: string;
  email: string;
  discord: string;
  past_positions: string;
  interested_in_returning: boolean;
  not_returning_reason: string | null;
  in_person_next_term: boolean;
  qualifications: string;
  additional_notes: string | null;
  submitted_at: string;
  position_selections: ReturningExecPositionSelection[];
}

/** Own submission returned for the form page */
export interface ReturningExecOwnSubmission extends ReturningExecSubmission {
  position_selections: ReturningExecPositionSelection[];
}
