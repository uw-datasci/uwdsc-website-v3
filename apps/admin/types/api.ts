// API Request and Response Types

// ============================================================================
// Auth Types
// ============================================================================

export interface SignInRequest {
  email: string;
  password: string;
}

export interface SignInResponse {
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
