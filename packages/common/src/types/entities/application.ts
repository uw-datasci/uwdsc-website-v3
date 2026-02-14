import type { ApplicationInputType } from "../shared/enums";

// ==========================================
//  Row-level types (1:1 with DB tables)
//  Used by web app and future backend
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
