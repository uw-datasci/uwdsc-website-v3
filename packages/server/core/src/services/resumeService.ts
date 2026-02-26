import type { SupabaseClient } from "@supabase/supabase-js";
import type { FileUploadData } from "@uwdsc/common/types";
import { FileService } from "./fileService";
import { RESUME_VALIDATION_CONFIG } from "../utils/resume";

export class ResumeService extends FileService {
  constructor(supabaseClient: SupabaseClient) {
    super(supabaseClient, "resumes", RESUME_VALIDATION_CONFIG);
  }

  /**
   * Clear all existing files in a user's folder.
   * Resume folders should only contain one file at a time.
   */
  private async clearFolder(userId: string): Promise<void> {
    const existingFiles = await this.repository.listFiles(userId);
    await this.repository.deleteFiles(existingFiles);
  }

  /**
   * Upload a resume for a user. Clears existing files first so each user
   * folder only ever contains one resume.
   */
  async uploadResume(
    data: FileUploadData,
  ): Promise<{ success: true; key: string } | { success: false; error: string }> {
    const validationError = this.validateFile(data.file);
    if (validationError) return validationError;

    try {
      await this.clearFolder(data.userId);
      return await this.upload(data);
    } catch (error) {
      return {
        success: false,
        error: (error as Error).message,
      };
    }
  }

  /**
   * Get a signed URL for a user's resume.
   * Returns null if no resume exists.
   */
  async getResumeUrl(userId: string): Promise<string | null> {
    try {
      console.log("HERE", userId);
      const files = await this.repository.listFiles(userId);
      const firstFile = files[0];
      if (!firstFile) return null;
      return await this.repository.getSignedUrl(firstFile);
    } catch {
      return null;
    }
  }
}
