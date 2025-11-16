// API Request and Response Types

// ============================================================================
// Auth Types
// ============================================================================

export interface RegisterRequest {
  email: string;
  password: string;
  metadata?: object;
}

export interface RegisterResponse {
  message: string;
  user?: {
    id: string;
    email: string;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  session?: {
    access_token: string;
    refresh_token: string;
  };
  user?: {
    id: string;
    email: string;
    email_confirmed_at: string | null;
  };
  error?: string;
}

export interface AuthMeResponse {
  user: {
    id: string;
    email: string;
    email_confirmed_at: string | null;
  };
  profile: UserProfile | null;
}

export interface ResendVerificationEmailRequest {
  email: string;
}

export interface ResendVerificationEmailResponse {
  message: string;
}

// ============================================================================
// User Types
// ============================================================================

export interface UserProfile {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  dob: string | null;
  role: string;
  nfc_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface UpdateProfileRequest {
  first_name: string;
  last_name: string;
  dob: string;
}

export interface UpdateProfileResponse {
  message: string;
  profile: UserProfile;
}

export interface GetProfileResponse {
  profile: UserProfile | null;
  error?: string;
  message?: string;
}

// ============================================================================
// Error Types
// ============================================================================

export interface ApiError {
  error: string;
  message?: string;
  details?: any;
}

// ============================================================================
// Generic API Response
// ============================================================================

export type ApiResponse<T> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      error: string;
      message?: string;
      details?: any;
    };
