import type { SupabaseClient } from "@supabase/supabase-js";
import { BaseRepository } from "@uwdsc/db/baseRepository";
import type {
  ExecTeamVpRoleRow,
  LoginData,
  RegisterData,
} from "@uwdsc/common/types";

export class AuthRepository extends BaseRepository {
  private readonly supabase: SupabaseClient;

  constructor(supabase: SupabaseClient) {
    super();
    this.supabase = supabase;
  }

  /**
   * Sign in user with email and password
   */
  async signInWithPassword(credentials: LoginData) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    return { data, error };
  }

  /**
   * Sign up new user
   */
  async signUp(credentials: RegisterData) {
    const { data, error } = await this.supabase.auth.signUp({
      email: credentials.email,
      password: credentials.password,
      options: { emailRedirectTo: credentials.emailRedirectTo },
    });

    return { data, error };
  }

  /**
   * Sign out current user
   */
  async signOut() {
    const { error } = await this.supabase.auth.signOut();
    return { error };
  }

  /**
   * Get current authenticated user
   */
  async getUser() {
    const { data, error } = await this.supabase.auth.getUser();
    return { data, error };
  }

  /**
   * Resend verification email
   */
  async resendVerificationEmail(email: string, emailRedirectTo?: string) {
    const { data, error } = await this.supabase.auth.resend({
      type: "signup",
      email,
      options: { emailRedirectTo },
    });

    return { data, error };
  }

  /**
   * Exchange code for session (PKCE flow - used by initial signup verification link)
   */
  async exchangeCodeForSession(code: string) {
    const { error } = await this.supabase.auth.exchangeCodeForSession(code);
    return error;
  }

  /**
   * Verify OTP/token (implicit flow - used when redirect has token_hash; resend() does not use PKCE)
   */
  async verifyOtp(params: { token_hash: string; type: "signup" | "email" }) {
    const { data, error } = await this.supabase.auth.verifyOtp(params);
    return { data, error };
  }

  /**
   * Send password reset email
   */
  async resetPasswordForEmail(email: string, emailRedirectTo?: string) {
    const { data, error } = await this.supabase.auth.resetPasswordForEmail(
      email,
      { redirectTo: emailRedirectTo },
    );

    return { data, error };
  }

  /**
   * Update user password
   */
  async updateUserPassword(newPassword: string) {
    const { data, error } = await this.supabase.auth.updateUser({
      password: newPassword,
    });

    return { data, error };
  }

  /**
   * Exec roles with VP flag and subteam name for a profile (application question access).
   * Subteam is resolved from `exec_positions.subteam_id` when set, otherwise `exec_team.subteam_id`.
   */
  async getExecTeamVpRolesForProfile(
    profileId: string,
  ): Promise<ExecTeamVpRoleRow[]> {
    return this.sql<ExecTeamVpRoleRow[]>`
      SELECT DISTINCT
        ep.is_vp,
        st.name AS subteam_name
      FROM exec_team et
      JOIN exec_positions ep ON et.position_id = ep.id
      JOIN subteams st ON st.id = COALESCE(ep.subteam_id, et.subteam_id)
      WHERE et.profile_id = ${profileId}
    `;
  }

  /**
   * `application_positions_available.id` for every open role whose `exec_positions.subteam_id`
   * matches a subteam the user serves as VP in (from `exec_team` + `exec_positions.is_vp`,
   * resolving subteam via COALESCE(ep.subteam_id, et.subteam_id)).
   */
  async getVpApplicationPositionIdsForProfile(
    profileId: string,
  ): Promise<number[]> {
    const rows = await this.sql<{ position_id: number }[]>`
      WITH vp_subteams AS (
        SELECT DISTINCT COALESCE(ep.subteam_id, et.subteam_id) AS sid
        FROM exec_team et
        JOIN exec_positions ep ON et.position_id = ep.id
        WHERE et.profile_id = ${profileId} AND ep.is_vp = true
      )
      SELECT DISTINCT apa.id AS position_id
      FROM application_positions_available apa
      JOIN exec_positions ep ON apa.position_id = ep.id
      WHERE ep.subteam_id IN (
        SELECT sid FROM vp_subteams WHERE sid IS NOT NULL
      )
    `;
    return rows.map((row) => row.position_id);
  }
}
