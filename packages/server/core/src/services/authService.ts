import { AuthRepository } from "../repositories/authRepository";
import type { SupabaseClient } from "@supabase/supabase-js";
import { ApiError, LoginData, RegisterData } from "@uwdsc/common/types";

export class AuthService {
  private readonly repository: AuthRepository;

  constructor(supabaseClient: SupabaseClient) {
    this.repository = new AuthRepository(supabaseClient);
  }

  /**
   * Authenticate user with email and password
   */
  async login(credentials: LoginData) {
    try {
      const { data, error } =
        await this.repository.signInWithPassword(credentials);

      if (error) {
        // Check for specific error cases
        if (error.message.includes("Email not confirmed")) {
          return {
            success: false,
            needsVerification: true,
            email: credentials.email,
            error: "Email not verified",
          };
        }

        return {
          success: false,
          error: error.message,
        };
      }

      return {
        success: true,
        user: data.user,
        session: data.session,
      };
    } catch (error) {
      throw new ApiError(`Login failed: ${(error as Error).message}`, 500);
    }
  }

  /**
   * Register new user
   */
  async register(credentials: RegisterData) {
    try {
      const { data, error } = await this.repository.signUp(credentials);

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      // Check if email confirmation is required
      const needsEmailConfirmation = data.user && !data.session;

      return {
        success: true,
        user: data.user,
        session: data.session,
        needsEmailConfirmation,
        message: needsEmailConfirmation
          ? "Please check your email to verify your account"
          : "Registration successful",
      };
    } catch (error) {
      throw new ApiError(
        `Registration failed: ${(error as Error).message}`,
        500,
      );
    }
  }

  /**
   * Sign out current user
   */
  async signOut() {
    try {
      const { error } = await this.repository.signOut();

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      return {
        success: true,
        message: "Signed out successfully",
      };
    } catch (error) {
      throw new ApiError(`Sign out failed: ${(error as Error).message}`, 500);
    }
  }

  /**
   * Get current authenticated user
   */
  async getCurrentUser() {
    try {
      const { data, error } = await this.repository.getUser();

      if (error || !data.user) {
        return {
          success: false,
          user: null,
          error: error?.message || "Not authenticated",
        };
      }

      return {
        success: true,
        user: data.user,
      };
    } catch (error) {
      throw new ApiError(
        `Failed to get user: ${(error as Error).message}`,
        500,
      );
    }
  }

  /**
   * Resend verification email.
   * Uses signUp() instead of auth.resend() because resend() does not support PKCE:
   * the link it sends uses implicit flow (token in URL fragment), so the server
   * callback never receives it and the user cannot be logged in. signUp() with
   * the same email sends a PKCE verification link that works with exchangeCodeForSession.
   */
  async resendVerificationEmail(email: string, emailRedirectTo: string) {
    try {
      const placeholderPassword = `Tmp${Math.random().toString(36).slice(2)}A1!`;
      const { data, error } = await this.repository.signUp({
        email,
        password: placeholderPassword,
        emailRedirectTo,
      });

      if (error) {
        if (
          error.message.includes("already registered") ||
          error.message.includes("already exists")
        ) {
          return {
            success: true,
            message: "If an account exists, a new verification email was sent.",
          };
        }
        return {
          success: false,
          error: error.message,
        };
      }

      if (data?.user && !data?.session) {
        return {
          success: true,
          message: "Verification email sent successfully",
        };
      }

      return {
        success: true,
        message: "If an account exists, a new verification email was sent.",
      };
    } catch (error) {
      throw new ApiError(
        `Failed to resend verification email: ${(error as Error).message}`,
        500,
      );
    }
  }

  /**
   * Exchange code for session (PKCE flow - initial signup verification link)
   */
  async exchangeCodeForSession(code: string) {
    try {
      const error = await this.repository.exchangeCodeForSession(code);

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      return { success: true, error: null };
    } catch (error) {
      throw new ApiError(
        `Failed to exchange code for session: ${(error as Error).message}`,
        500,
      );
    }
  }

  /**
   * Verify OTP (implicit flow - when redirect has token_hash; auth.resend() does not use PKCE)
   */
  async verifyOtp(params: { token_hash: string; type: "signup" | "email" }) {
    try {
      const { error } = await this.repository.verifyOtp(params);

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      return { success: true, error: null };
    } catch (error) {
      throw new ApiError(
        `Failed to verify OTP: ${(error as Error).message}`,
        500,
      );
    }
  }

  /**
   * Send password reset email
   */
  async forgotPassword(email: string, emailRedirectTo: string) {
    try {
      const { error } = await this.repository.resetPasswordForEmail(
        email,
        emailRedirectTo,
      );

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      return {
        success: true,
        message: "Password reset email sent successfully",
      };
    } catch (error) {
      throw new ApiError(
        `Failed to send password reset email: ${(error as Error).message}`,
        500,
      );
    }
  }

  /**
   * Reset user password
   */
  async resetPassword(newPassword: string) {
    try {
      const { error } = await this.repository.updateUserPassword(newPassword);

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      return {
        success: true,
        message: "Password reset successfully",
      };
    } catch (error) {
      throw new ApiError(
        `Failed to reset password: ${(error as Error).message}`,
        500,
      );
    }
  }
}
