import type {
  ApplicationInputType,
  ApplicationReviewStatus,
  ApplicationStatus,
  UserRole,
} from "../shared/enums";

// ==========================================
//  Row-level types (1:1 with DB tables)
// ==========================================

/** Mirrors questions table */
export interface Question {
  id: string;
  question_text: string;
  type: ApplicationInputType;
  max_length: number | null;
  placeholder: string | null;
  help_text: string | null;
  created_at: string;
  updated_at: string;
  archived_at: string | null;
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
  linkedin_url: string | null;
  github_url: string | null;
  portfolio_url: string | null;
  status: ApplicationStatus;
  submitted_at: string;
  applicant_role: UserRole | null;
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
  question_text: string | null;
}

// ==========================================
//  Composite types
// ==========================================

/** Question with sort_order from position_questions bridge */
export interface QuestionWithSortOrder extends Omit<Question, "updated_at" | "archived_at"> {
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
