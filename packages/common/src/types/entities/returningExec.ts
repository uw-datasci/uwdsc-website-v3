import type { ApplicationReviewStatus } from "../shared/enums";

/** Presence / location for next term on the returning-exec form. */
export type InPersonNextTermStatus =
  | "yes"
  | "no_outside_gta"
  | "no_in_gta"
  | "not_sure";

export const IN_PERSON_NEXT_TERM_LABELS: Record<InPersonNextTermStatus, string> = {
  yes: "Yes",
  no_outside_gta: "No, outside of GTA",
  no_in_gta: "No, but in the GTA (able to commute to Waterloo)",
  not_sure: "Not sure",
};

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
  interested_in_future_term: string | null;
  not_returning_reason: string | null;
  in_person_next_term: InPersonNextTermStatus | null;
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
  interested_in_future_term: string | null;
  not_returning_reason: string | null;
  in_person_next_term: InPersonNextTermStatus | null;
  qualifications: string;
  additional_notes: string | null;
  submitted_at: string;
  position_selections: ReturningExecPositionSelection[];
}

/** Own submission returned for the form page */
export interface ReturningExecOwnSubmission extends ReturningExecSubmission {
  position_selections: ReturningExecPositionSelection[];
}
