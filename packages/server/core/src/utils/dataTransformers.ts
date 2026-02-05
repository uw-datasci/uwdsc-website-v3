/**
 * Data Transformation Utilities
 *
 * Shared utilities for transforming data between database and application formats.
 */

/**
 * Converts a comma-separated string to an array
 * @param value - Comma-separated string or null
 * @returns Array of trimmed, non-empty strings
 */
export function splitCommaSeparatedString(
  value: string | null | undefined,
): string[] {
  if (!value) return [];
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

/**
 * Converts an array to a comma-separated string
 * @param value - Array of strings or null
 * @returns Comma-separated string or empty string
 */
export function joinArrayToCommaSeparatedString(
  value: string[] | null | undefined,
): string {
  if (!value || !Array.isArray(value)) return "";
  return value.join(",");
}
