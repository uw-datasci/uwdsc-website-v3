// Error types
// Standardized error response formats

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface ErrorResponse {
  error: string;
  message?: string;
  details?: ValidationError[];
}
