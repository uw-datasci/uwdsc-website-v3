import type { SupabaseClient } from "@supabase/supabase-js";
import type { FileUploadData, UploadError, UploadResult } from "@uwdsc/common/types";
import { FileService } from "./file.service";
import { PROFILE_PHOTO_VALIDATION_CONFIG } from "../../utils/profile-photo";

export class ProfilePhotoService extends FileService {
  constructor(supabaseClient: SupabaseClient) {
    super(supabaseClient, "profile-photos", PROFILE_PHOTO_VALIDATION_CONFIG);
  }

  /**
   * Clear all existing files in a user's folder.
   * Profile photo folders should only contain one file at a time.
   */
  private async clearFolder(userId: string): Promise<void> {
    const existingFiles = await this.repository.listFiles(userId);
    await this.repository.deleteFiles(existingFiles);
  }

  /**
   * Upload a profile photo for a user. Clears existing files first so each
   * user folder only ever contains one photo.
   */
  async uploadProfilePhoto(data: FileUploadData): Promise<UploadResult | UploadError> {
    const validationError = this.validateFile(data.file);
    if (validationError) return validationError;

    const objectKey = `${data.userId}/${this.resolveFileName(data.file)}`;

    try {
      await this.clearFolder(data.userId);
      return await this.upload(data, objectKey);
    } catch (error) {
      return {
        success: false,
        error: (error as Error).message,
      };
    }
  }

  /**
   * Remove a user's profile photo, if one exists.
   */
  async deleteProfilePhoto(userId: string): Promise<void> {
    await this.clearFolder(userId);
  }

  /**
   * Get a signed URL for a user's profile photo.
   * Returns null if no photo exists.
   */
  async getProfilePhotoUrl(userId: string): Promise<string | null> {
    try {
      const files = await this.repository.listFiles(userId);
      const firstFile = files[0];
      if (!firstFile) return null;
      return await this.repository.getSignedUrl(firstFile);
    } catch {
      return null;
    }
  }
}
