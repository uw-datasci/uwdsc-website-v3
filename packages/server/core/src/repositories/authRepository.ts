import type { SupabaseClient } from "@supabase/supabase-js";
import type { LoginData, RegisterData } from "@uwdsc/common/types";

export class AuthRepository {
  private readonly supabase: SupabaseClient;

  constructor(supabase: SupabaseClient) {
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
      options: {
        emailRedirectTo: credentials?.emailRedirectTo,
      },
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
      options: {
        emailRedirectTo,
      },
    });

    return { data, error };
  }

  /**
   * Exchange code for session
   */
  async exchangeCodeForSession(code: string) {
    const { error } = await this.supabase.auth.exchangeCodeForSession(code);
    return error;
  }

  /**
   * Send password reset email
   */
  async resetPasswordForEmail(email: string, emailRedirectTo?: string) {
    const { data, error } = await this.supabase.auth.resetPasswordForEmail(
      email,
      {
        redirectTo: emailRedirectTo,
      },
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
}
