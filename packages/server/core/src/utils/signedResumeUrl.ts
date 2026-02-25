/**
 * Helpers for getSignedResumeUrl logic (reduce cognitive complexity).
 */

const COMMON_RESUME_NAMES = ["resume", "Resume", "RESUME", "cv", "CV"] as const;
const COMMON_RESUME_EXTENSIONS = [".pdf", ".docx", ".doc"] as const;

/** Result shape from getUserResume (success or failure). */
export type GetUserResumeResult =
  | { success: true; key: string | null; resume: unknown; error?: never }
  | { success: false; error: string; key?: never; resume?: never };

/**
 * Whether we should fall back to trying common resume file patterns
 * (e.g. when listing fails or no key/resume was found).
 */
export function shouldTryCommonResumePatterns(
  result: GetUserResumeResult,
): boolean {
  if (!result.success) return true;
  return !result.key || !result.resume;
}

/**
 * List of object keys to try for common resume filenames (userId/name.ext).
 */
export function getCommonResumeObjectKeys(userId: string): string[] {
  const keys: string[] = [];
  for (const name of COMMON_RESUME_NAMES) {
    for (const ext of COMMON_RESUME_EXTENSIONS) {
      keys.push(`${userId}/${name}${ext}`);
    }
  }
  return keys;
}

/**
 * Build the final "not found" error response from getUserResume result.
 */
export function formatResumeNotFoundError(result: GetUserResumeResult): {
  success: false;
  error: string;
} {
  const message = result.success
    ? "No resume found"
    : result.error || "Failed to get resume";
  return { success: false, error: message };
}
