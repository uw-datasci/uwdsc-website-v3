import type { ApplicationInputType } from "../shared/enums";

// ==========================================
// Application API types (repository & service)
// ==========================================

/** Profile data for application autofill */
export interface ProfileAutofill {
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  term: string | null;
}

/** Payload for updating an application (API layer) */
export interface ApplicationUpdatePayload {
  full_name?: string;
  major?: string;
  year_of_study?: string;
  personal_email?: string;
  location?: string;
  club_experience?: boolean;
  resume_url?: string;
  position_selections?: PositionSelectionInput[];
  answers?: AnswerInput[];
  /** When true, marks the application as submitted after applying updates */
  submit?: boolean;
}

/** Input for position selection upsert */
export interface PositionSelectionInput {
  position_id: string;
  priority: number;
}

/** Input for answer upsert */
export interface AnswerInput {
  question_id: string;
  answer_text: string;
}

/** Row from getAvailablePositions query */
export interface ApplicationPositionRow {
  id: string;
  position_id: string;
  name: string;
}

/** Row from getQuestionsForPositions query. Extends Question with position_id and sort_order from position_questions. */
export interface QuestionRow {
  id: string;
  question_text: string;
  type: ApplicationInputType;
  max_length: number | null;
  placeholder: string | null;
  help_text: string | null;
  created_at: string;
  position_id: string | null;
  sort_order: number;
}

/** Data required to create a new application */
export interface CreateApplicationData {
  profile_id: string;
  term_id: string;
  full_name: string;
}

/** Data for application update (repository layer, excludes nested selections/answers) */
export interface UpdateApplicationData {
  full_name?: string;
  major?: string;
  year_of_study?: string;
  personal_email?: string;
  location?: string;
  club_experience?: boolean;
  resume_url?: string;
  /** When true, sets status to 'submitted' and submitted_at to NOW() */
  submit?: boolean;
}

/** General question in getPositionsWithQuestions response */
export interface GeneralQuestion {
  id: string;
  question_text: string;
  sort_order: number;
  placeholder: string | null;
}
