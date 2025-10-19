// API Request and Response Types

// ============================================================================
// Auth Types
// ============================================================================

export interface RegisterRequest {
  email: string;
  password: string;
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
  user_status: string | null;
  has_paid: boolean;
  is_math_soc_member: boolean;
  faculty: string | null;
  term: string | null;
  wat_iam: string | null;
  heard_from_where: string | null;
  member_ideas: string | null;
  created_at: string;
  updated_at: string;
}

export interface UpdateProfileRequest {
  first_name?: string;
  last_name?: string;
  wat_iam?: string;
  faculty?: string;
  term?: string;
  heard_from_where?: string;
  member_ideas?: string;
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
// Admin/Membership Types
// ============================================================================

export interface MemberProfile {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  user_status: string | null;
  has_paid: boolean;
  is_math_soc_member: boolean;
  faculty: string | null;
  term: string | null;
  wat_iam: string | null;
  created_at: string;
  updated_at: string;
}

export interface GetAllProfilesResponse {
  profiles: MemberProfile[];
  error?: string;
  message?: string;
}

export interface MembershipStats {
  totalUsers: number;
  paidUsers: number;
  mathSocMembers: number;
}

export interface GetMembershipStatsResponse {
  stats: MembershipStats;
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
