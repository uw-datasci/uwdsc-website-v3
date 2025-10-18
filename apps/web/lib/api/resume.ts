/**
 * File Upload API Functions
 *
 * This file contains all file upload-related API calls.
 * Components should use these functions instead of making direct fetch calls.
 */

import { createApiError } from "./errors";

// ============================================================================
// Types
// ============================================================================

export interface UploadResumeResponse {
  message: string;
  key: string;
}

// ============================================================================
// File Upload API Functions
// ============================================================================

/**
 * Upload a resume file for the current user
 *
 * @param file - The resume file to upload (PDF, DOC, or DOCX)
 * @returns Promise with upload response containing the file key
 * @throws Error if upload fails (invalid file type, too large, unauthorized, etc.)
 */
export async function uploadResume(file: File): Promise<UploadResumeResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/applications/resumes", {
    method: "POST",
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw createApiError(data, response.status);
  }

  return data;
}
