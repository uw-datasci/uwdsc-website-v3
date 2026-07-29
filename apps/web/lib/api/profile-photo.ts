/**
 * Profile Photo API Functions
 *
 * This file contains all profile photo upload-related API calls.
 * Components should use these functions instead of making direct fetch calls.
 */

import type {
  ProfilePhotoStatusResponse,
  UploadProfilePhotoResponse,
} from "@/types/profile-photo";
import { createApiError } from "./errors";

/**
 * Upload a profile photo for the current user
 *
 * @param file - The image file to upload (JPG, PNG, or WEBP, up to 5MB)
 * @returns Promise with upload response containing the file key and signed URL
 * @throws Error if upload fails (invalid file type, too large, unauthorized, etc.)
 */
export async function uploadProfilePhoto(file: File): Promise<UploadProfilePhotoResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/profile/photo", {
    method: "POST",
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw createApiError(data, response.status);
  }

  return data;
}

/**
 * Get the current user's profile photo status and signed URL
 */
export async function getProfilePhotoStatus(): Promise<ProfilePhotoStatusResponse> {
  const response = await fetch("/api/profile/photo");
  const data = await response.json();

  if (!response.ok) {
    throw createApiError(data, response.status);
  }

  return data as ProfilePhotoStatusResponse;
}

/**
 * Delete the current user's profile photo
 */
export async function deleteProfilePhoto(): Promise<{ message: string }> {
  const response = await fetch("/api/profile/photo", {
    method: "DELETE",
  });

  const data = await response.json();

  if (!response.ok) {
    throw createApiError(data, response.status);
  }

  return data;
}
