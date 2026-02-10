// Common shared types
// Utility types used across the application

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
