import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  HeadshotUploadData,
  UploadError,
  UploadResult,
} from "@uwdsc/common/types";
import { FileService } from "@uwdsc/core";
import { HEADSHOT_VALIDATION_CONFIG } from "../utils/headshot";

export class HeadshotService extends FileService {
  constructor(supabaseClient: SupabaseClient) {
    super(supabaseClient, "team", HEADSHOT_VALIDATION_CONFIG);
  }

  /**
   * Remove any existing headshot files in the root of the bucket that share
   * the same base name. This ensures only one headshot exists per name
   * regardless of file extension.
   */
  private async clearExistingHeadshot(baseName: string): Promise<void> {
    const rootFiles = await this.repository.listFiles("");
    const toDelete = rootFiles.filter((path) => {
      const name = path.split("/").pop() ?? path;
      return name.startsWith(`${baseName}.`);
    });
    await this.repository.deleteFiles(toDelete);
  }

  async uploadHeadshot(
    data: HeadshotUploadData,
  ): Promise<UploadResult | UploadError> {
    const validationError = this.validateFile(data.file);
    if (validationError) return validationError;

    const baseName = data.fullName.trim().replaceAll(/\s+/g, "-");

    if (!baseName) return { success: false, error: "Full name is required" };

    const extension = this.validationConfig.mimeToExtension?.(data.file.type);
    const ext = extension ?? data.file.name.replace(/^.*\./, "");
    const objectKey = `${baseName}.${ext}`;

    try {
      await this.clearExistingHeadshot(baseName);
      return await this.upload(data, objectKey);
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }
}
