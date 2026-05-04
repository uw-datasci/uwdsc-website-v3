/**
 * Application question bank (admin VP tooling): scope, positions, and joined rows.
 * Aligns with `questions`, `position_questions`, and `application_positions_available`.
 */

/**
 * VP / Presidents scope for CRUD — from exec_team, exec_positions (is_vp, subteam),
 * and application_positions_available ids for question assignment.
 */
export interface QuestionScope {
  /** True if the user holds any exec role with `exec_positions.is_vp` (via exec_team). */
  hasVpExecRole: boolean;
  /** VP on Presidents subteam (exec + subteam name). */
  isPresident: boolean;
  /** VP subteam names resolved from exec roles (excluding Presidents). */
  vpSubteamNames: string[];
  /** VP subteam ids resolved from exec roles (excluding Presidents). */
  vpSubteamIds: number[];
  /** `application_positions_available.id` scoped to the user’s VP subteam(s) (see auth repository). */
  vpPositionIds: number[];
}

/** Open role option for assigning a question to a position. */
export interface QuestionPositionOption {
  id: number;
  name: string;
}

/**
 * Payload for creating or updating a question + its `position_questions` link
 * (matches admin zod schema and repository insert/update).
 */
export interface QuestionUpsertInput {
  question_text: string;
  type: "text" | "textarea";
  max_length?: number | null;
  placeholder?: string | null;
  help_text?: string | null;
  sort_order: number;
  position_id: number | null;
}

/** Joined row: position_questions + questions + exec role label. */
export interface AppQuestion {
  position_question_id: number;
  question_id: number;
  position_id: number | null;
  position_name: string | null;
  can_edit?: boolean;
  question_text: string;
  type: "text" | "textarea";
  max_length: number | null;
  placeholder: string | null;
  help_text: string | null;
  sort_order: number;
  created_at: string;
}

/** GET /api/applications/questions */
export interface QuestionsListResponse {
  questions: AppQuestion[];
  positions: QuestionPositionOption[];
  scope: {
    isPresident: boolean;
    hasVpExecRole: boolean;
    vpSubteamNames: string[];
  };
}
