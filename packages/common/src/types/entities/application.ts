import type {
  ApplicationInputType,
  ApplicationReviewStatus,
  ApplicationStatus,
} from "../shared/enums";

// ==========================================
//  Row-level types (1:1 with DB tables)
// ==========================================

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
  application_deadline: string;
  created_at: string;
}

/** Mirrors application_positions_available table */
export interface ApplicationPositionAvailable {
  id: string;
  position_id: string;
}

/** Mirrors questions table */
export interface Question {
  id: string;
  question_text: string;
  type: ApplicationInputType;
  max_length: number | null;
  placeholder: string | null;
  help_text: string | null;
  created_at: string;
}

/** Mirrors position_questions bridge table. position_id is null for general questions. */
export interface PositionQuestion {
  id: string;
  position_id: string | null;
  question_id: string;
  sort_order: number;
}

/** Mirrors applications table */
export interface Application {
  id: string;
  profile_id: string;
  term_id: string;
  resume_url: string | null;
  full_name: string;
  major: string | null;
  year_of_study: string | null;
  personal_email: string | null;
  location: string | null;
  club_experience: boolean | null;
  status: ApplicationStatus;
  submitted_at: string;
}

/** Mirrors application_position_selections table. priority is 1-3. */
export interface ApplicationPositionSelection {
  id: string;
  application_id: string;
  position_id: string;
  priority: number;
  status: ApplicationReviewStatus;
}

/** Mirrors answers table */
export interface Answer {
  id: string;
  application_id: string;
  question_id: string;
  answer_text: string;
}

// ==========================================
//  Composite types
// ==========================================

/** Question with sort_order from position_questions bridge */
export interface QuestionWithSortOrder extends Question {
  sort_order: number;
  position_id: string | null;
}

/** Position (application_positions_available + exec_position) with its questions */
export interface PositionWithQuestions {
  id: string;
  position_id: string;
  name: string;
  questions: QuestionWithSortOrder[];
}

/** Application with position selections and answers */
export interface ApplicationWithDetails extends Application {
  position_selections: ApplicationPositionSelection[];
  answers: Answer[];
}
