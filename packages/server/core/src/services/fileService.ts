import { FileRepository } from "../repositories/fileRepository";
import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  FileValidationConfig,
  FileUploadData,
  UploadResult,
  UploadError,
} from "@uwdsc/common/types";

export class FileService {
  protected readonly repository: FileRepository;
  protected readonly validationConfig: FileValidationConfig;

  constructor(
    supabaseClient: SupabaseClient,
    bucketName: string,
    validationConfig: FileValidationConfig,
  ) {
    this.repository = new FileRepository(supabaseClient, bucketName);
    this.validationConfig = validationConfig;
  }

  /**
   * Validate a file against the configured validation rules.
   */
  protected validateFile(file: File): UploadError | null {
    if (file.size > this.validationConfig.maxBytes) {
      const maxMB = Math.round(this.validationConfig.maxBytes / (1024 * 1024));
      return { success: false, error: `File must be under ${maxMB} MB` };
    }

    if (!this.validationConfig.allowedMimeTypes.has(file.type)) {
      return { success: false, error: "File type not allowed" };
    }

    if (this.validationConfig.customValidation) {
      const result = this.validationConfig.customValidation(file);
      if (result && !result.valid) {
        return {
          success: false,
          error: result.error ?? "File validation failed",
        };
      }
    }

    return null;
  }

  /**
   * Resolve the final filename for a file, normalising the extension via
   * the validation config's mimeToExtension mapping when available.
   */
  protected resolveFileName(file: File): string {
    const extension = this.validationConfig.mimeToExtension?.(file.type);
    return extension
      ? `${file.name.replace(/\.[^.]+$/, "")}.${extension}`
      : file.name;
  }

  /**
   * Validate and upload a file to the given object key within the bucket.
   */
  async upload(
    data: FileUploadData,
    objectKey: string,
  ): Promise<UploadResult | UploadError> {
    const validationError = this.validateFile(data.file);
    if (validationError) return validationError;

    try {
      const key = await this.repository.uploadFile({
        file: data.file,
        userId: data.userId,
        objectKey,
        contentType: data.file.type,
      });

      return { success: true, key };
    } catch (error) {
      return {
        success: false,
        error: (error as Error).message,
      };
    }
  }
}
