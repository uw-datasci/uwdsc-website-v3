import type { SupabaseClient } from "@supabase/supabase-js";
import { BaseRepository } from "@uwdsc/db/base.repository";
import type { LoginData, RegisterData } from "@uwdsc/common/types";

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
      password: credentials.password
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
      options: { emailRedirectTo: credentials.emailRedirectTo }
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
      options: { emailRedirectTo }
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
  async verifyOtp(params: { token_hash: string; type: "signup" | "email" | "recovery" }) {
    const { data, error } = await this.supabase.auth.verifyOtp(params);
    return { data, error };
  }

  /**
   * Check whether an auth user exists for the given email (case-insensitive).
   */
  async authUserExistsByEmail(email: string): Promise<boolean> {
    const normalized = email.trim().toLowerCase();

    const rows = await this.sql<{ id: string }[]>`
      SELECT id
      FROM auth.users
      WHERE lower(trim(email)) = ${normalized}
      LIMIT 1
    `;

    return rows.length > 0;
  }

  /**
   * Send password reset email
   */
  async resetPasswordForEmail(email: string, emailRedirectTo?: string) {
    const { data, error } = await this.supabase.auth.resetPasswordForEmail(email, {
      redirectTo: emailRedirectTo
    });

    return { data, error };
  }

  /**
   * Update user password
   */
  async updateUserPassword(newPassword: string) {
    const { data, error } = await this.supabase.auth.updateUser({
      password: newPassword
    });

    if (!error && data?.user?.id) {
      const userId = data.user.id;
      // Counter increments are best-effort — a failure here must not roll back
      // the password change the user already completed in Supabase.
      try {
        await this.sql`
          UPDATE profiles
          SET password_reset_count = password_reset_count + 1,
              updated_at = now()
          WHERE id = ${userId}
        `;
        await this.sql`
          UPDATE public.memberships
          SET password_reset_count = password_reset_count + 1,
              updated_at = now()
          WHERE profile_id = ${userId}
            AND term_id = (SELECT id FROM public.terms WHERE is_active = true LIMIT 1)
        `;
      } catch (incrementError) {
        console.error("Failed to increment password reset counters:", incrementError);
      }
    }

    return { data, error };
  }

  /**
   * `application_positions_available.id` for every role (open OR closed) in the given
   * subteam. Deliberately not filtered on `apa.is_open`: a VP must keep review access
   * and question-edit rights for a role after a President closes it mid-cycle, so
   * submitted applicants aren't orphaned from their reviewer.
   */
  async getApplicationPositionIdsForSubteam(subteamId: number): Promise<number[]> {
    const rows = await this.sql<{ position_id: number }[]>`
      SELECT DISTINCT apa.id AS position_id
      FROM hiring.application_positions_available apa
      JOIN org.exec_positions ep ON apa.position_id = ep.id
      WHERE ep.subteam_id = ${subteamId}
    `;
    return rows.map((row) => row.position_id);
  }

  /**
   * `org.exec_positions.id` for every role in the given subteam. Unlike
   * `getApplicationPositionIdsForSubteam`, this is NOT joined through
   * `hiring.application_positions_available` — a VP must be able to review
   * returning-exec role preferences even for roles that aren't open on the
   * external application.
   */
  async getExecPositionIdsForSubteam(subteamId: number): Promise<number[]> {
    const rows = await this.sql<{ position_id: number }[]>`
      SELECT ep.id AS position_id
      FROM org.exec_positions ep
      WHERE ep.subteam_id = ${subteamId}
    `;
    return rows.map((row) => row.position_id);
  }
}
