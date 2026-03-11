import type { SupabaseClient } from "@supabase/supabase-js";
import type { FileUploadData } from "@uwdsc/common/types";
import { FileService } from "./fileService";
import { HEADSHOT_VALIDATION_CONFIG } from "../utils/headshot";

export class HeadshotService extends FileService {
  constructor(supabaseClient: SupabaseClient) {
    super(supabaseClient, "team", HEADSHOT_VALIDATION_CONFIG);
  }

  /**
   * Remove any existing headshot files in the user's folder before uploading.
   * This ensures there is only ever one headshot per user.
   */
  private async clearFolder(userId: string): Promise<void> {
    const existing = await this.repository.listFiles(userId);
    await this.repository.deleteFiles(existing);
  }

  async uploadHeadshot(
    data: FileUploadData,
  ): Promise<{ success: true; key: string } | { success: false; error: string }> {
    const validationError = this.validateFile(data.file);
    if (validationError) return validationError;

    try {
      await this.clearFolder(data.userId);
      return await this.upload(data);
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }
}
