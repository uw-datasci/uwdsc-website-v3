/**
 * Application question bank (admin VP tooling): scope, positions, and joined rows.
 * Aligns with `questions`, `position_questions`, and `application_positions_available`.
 */

/**
 * VP / Presidents scope for CRUD - resolved from the caller's role claims
 * (`user_roles.role` + `user_roles.subteam_id`, mirrored into Supabase app_metadata)
 * and the positions belonging to that subteam.
 *
 * Presidents are unscoped: every consumer short-circuits on `isPresident`, so the
 * subteam and position arrays are empty for them.
 */
export interface QuestionScope {
  /** True if `user_role === "pres"`. */
  isPresident: boolean;
  /** The VP's subteam name, or empty for presidents and non-VPs. */
  vpSubteamNames: string[];
  /** The VP's subteam id, or empty for presidents and non-VPs. */
  vpSubteamIds: number[];
  /**
   * `application_positions_available.id` scoped to the user’s VP subteam (see auth repository).
   * External application only — do not use for returning-exec authorization checks.
   */
  vpPositionIds: number[];
  /**
   * `org.exec_positions.id` scoped to the user’s VP subteam, independent of application
   * availability. Use this for returning-exec role-preference authorization checks.
   */
  vpExecPositionIds: number[];
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
    vpSubteamNames: string[];
  };
}
