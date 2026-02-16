/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * API Error Utilities
 */

/**
 * Creates a proper Error object with additional API error properties
 *
 * @param data - Response data from the API
 * @param status - HTTP status code
 * @returns Error object with error, message, details, and status properties
 */
export function createApiError(data: any, status: number) {
  return Object.assign(
    new Error(data.message || data.error || "Request failed"),
    {
      error: data.error || data.message || "Request failed",
      message: data.message,
      details: data,
      status,
    },
  );
}
