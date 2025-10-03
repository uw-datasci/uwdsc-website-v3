import {
  createConnectionPool,
  createKyselyInstance,
} from "../database/connection";
import { AuthRepository } from "../repository/authRepository";
import {
  RegisterData,
  LoginData,
  AuthResponse,
  UserResponse,
  SignOutResponse,
} from "../types/auth";

export class AuthService {
  private readonly authRepository: AuthRepository;

  constructor() {
    const pool = createConnectionPool(process.env.DATABASE_URL!);
    const db = createKyselyInstance(pool);
    this.authRepository = new AuthRepository(db, pool);
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const email = data.email.toLowerCase().trim();

      const { data: authData, error } = await this.authRepository.createUser({
        email,
        password: data.password,
      });

      if (error) {
        return {
          success: false,
          user: null,
          session: null,
          error: error.message,
        };
      }

      return {
        success: true,
        user: authData.user,
        session: authData.session,
        error: null,
      };
    } catch {
      return {
        success: false,
        user: null,
        session: null,
        error: "Registration failed",
      };
    }
  }

  async login(data: LoginData): Promise<AuthResponse> {
    try {
      const email = data.email.toLowerCase().trim();

      const { data: authData, error } =
        await this.authRepository.authenticateUser({
          email,
          password: data.password,
        });

      if (error) {
        
        // Special case: if email is not confirmed, we want to allow the login
        // but indicate that email verification is needed
        if (error.message === "Email not confirmed") {
          return {
            success: true,
            user: null, // No user data since they're not fully authenticated
            session: null, // No session until email is verified
            error: "email_not_verified", // Custom error code for client handling
          };
        }
        
        return {
          success: false,
          user: null,
          session: null,
          error: error.message,
        };
      }

      return {
        success: true,
        user: authData.user,
        session: authData.session,
        error: null,
      };
    } catch (error) {
      console.error("Login service error:", error); // Debug log
      return {
        success: false,
        user: null,
        session: null,
        error: "Login failed",
      };
    }
  }

  async getCurrentUser(): Promise<UserResponse> {
    try {
      const user = await this.authRepository.getCurrentUser();
      return {
        success: true,
        user,
        error: null,
      };
    } catch {
      return {
        success: false,
        user: null,
        error: "Failed to get user",
      };
    }
  }

  async signOut(): Promise<SignOutResponse> {
    try {
      const { error } = await this.authRepository.signOutUser();
      return { success: !error, error: error?.message || null };
    } catch {
      return { success: false, error: "Sign out failed" };
    }
  }
}
