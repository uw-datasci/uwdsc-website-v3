/**
 * File Upload API Functions
 *
 * This file contains all file upload-related API calls.
 * Components should use these functions instead of making direct fetch calls.
 */

import { createApiError } from "./error";

// ============================================================================
// Types
// ============================================================================

export interface UploadHeadshotResponse {
  message: string;
  key: string;
  url: string;
}

// ============================================================================
// File Upload API Functions
// ============================================================================

/**
 * Upload a headshot file for the current user
 *
 * @param file - The headshot file to upload (JPG, PNG, or WEBP)
 * @param fullName - Full name; spaces become hyphens in the storage filename
 * @returns Promise with upload response containing the file key
 * @throws Error if upload fails (invalid file type, too large, unauthorized, etc.)
 */

export async function uploadHeadshot(
  file: File,
  fullName: string,
): Promise<UploadHeadshotResponse> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("fullName", fullName);

  const response = await fetch("/api/onboarding/headshots", {
    method: "POST",
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) throw createApiError(data, response.status);

  return data;
}
