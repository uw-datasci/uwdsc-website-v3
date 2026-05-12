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
  const message = data.message ?? data.error ?? "Request failed";
  return Object.assign(new Error(message), {
    error: data.error ?? data.message ?? "Request failed",
    message,
    details: data,
    status,
  });
}
