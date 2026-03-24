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
  readonly hasVpExecRole: boolean;
  /** VP on Presidents subteam (exec + subteam name). */
  readonly isPresident: boolean;
  /** VP subteam names resolved from exec roles (excluding Presidents). */
  readonly vpSubteamNames: string[];
  /** `application_positions_available.id` scoped to the user’s VP subteam(s) (see auth repository). */
  readonly vpPositionIds: number[];
}

/** Open role option for assigning a question to a position. */
export interface QuestionPositionOption {
  readonly id: number;
  readonly name: string;
}

/**
 * Payload for creating or updating a question + its `position_questions` link
 * (matches admin zod schema and repository insert/update).
 */
export interface QuestionUpsertInput {
  readonly question_text: string;
  readonly type: "text" | "textarea";
  readonly max_length?: number | null;
  readonly placeholder?: string | null;
  readonly help_text?: string | null;
  readonly sort_order: number;
  readonly position_id: number | null;
}

/** Joined row: position_questions + questions + exec role label. */
export interface AppQuestion {
  readonly relation_id: number;
  readonly question_id: number;
  readonly position_id: number | null;
  readonly position_name: string | null;
  readonly question_text: string;
  readonly type: "text" | "textarea";
  readonly max_length: number | null;
  readonly placeholder: string | null;
  readonly help_text: string | null;
  readonly sort_order: number;
  readonly created_at: string;
}

/** GET /api/applications/review/questions */
export interface QuestionsListResponse {
  readonly questions: AppQuestion[];
  readonly positions: QuestionPositionOption[];
  readonly scope: {
    readonly isPresident: boolean;
    readonly hasVpExecRole: boolean;
    readonly vpSubteamNames: string[];
  };
}
