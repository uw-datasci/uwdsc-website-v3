/**
 * Row shape for exec VP roles joined to subteam name (e.g. `getExecTeamVpRolesForProfile`).
 * Feeds `QuestionScope` in `AuthService.getQuestionScopeForUser`.
 */
export interface ExecTeamVpRoleRow {
  readonly is_vp: boolean;
  readonly subteam_name: string | null;
}
