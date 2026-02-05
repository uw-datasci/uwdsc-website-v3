import { FileRepository } from "../repositories/fileRepository";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { FileObject } from "@supabase/storage-js";
import type { FileValidationConfig, FileUploadData } from "../types/file";
import { ApiError } from "../types/errors";

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
   * Generate object key for the file
   * Can be overridden by subclasses for specific naming schemes
   */
  protected generateObjectKey(userId: string, fileName: string): string {
    return `${userId}/${fileName}`;
  }

  /**
   * Validate file
   */
  protected validateFile(file: File): { valid: boolean; error?: string } {
    // Check file size
    if (file.size > this.validationConfig.maxBytes) {
      return {
        valid: false,
        error: `File too large. Max ${this.validationConfig.maxBytes / (1024 * 1024)} MB.`,
      };
    }

    // Check MIME type
    const mime = file.type || "";
    if (!this.validationConfig.allowedMimeTypes.has(mime)) {
      return {
        valid: false,
        error: "Invalid file type.",
      };
    }

    // Run custom validation if provided
    if (this.validationConfig.customValidation) {
      const customResult = this.validationConfig.customValidation(file);
      if (customResult && !customResult.valid) {
        return customResult;
      }
    }

    return { valid: true };
  }

  /**
   * Upload a file
   */
  async uploadFile(uploadData: FileUploadData) {
    try {
      const { file, userId } = uploadData;

      // Validate file
      const validation = this.validateFile(file);
      if (!validation.valid) {
        return {
          success: false,
          error: validation.error,
        };
      }

      // Get file extension if needed
      if (this.validationConfig.mimeToExtension) {
        const ext = this.validationConfig.mimeToExtension(file.type);
        if (!ext) {
          return {
            success: false,
            error: "Unsupported content type",
          };
        }
      }

      // Generate object key
      const objectKey = this.generateObjectKey(userId, file.name);

      // Upload to storage
      const { error } = await this.repository.uploadFile({
        file,
        userId,
        objectKey,
        contentType: file.type,
      });

      if (error) {
        return {
          success: false,
          error: `Upload failed: ${error.message}`,
        };
      }

      return {
        success: true,
        key: objectKey,
        message: "Upload successful",
      };
    } catch (error) {
      throw new ApiError(
        `File upload failed: ${(error as Error).message}`,
        500,
      );
    }
  }

  /**
   * Get file URL
   */
  async getFileUrl(objectKey: string) {
    try {
      const url = await this.repository.getFileUrl(objectKey);
      return {
        success: true,
        url,
      };
    } catch (error) {
      throw new ApiError(
        `Failed to get file URL: ${(error as Error).message}`,
        500,
      );
    }
  }

  /**
   * Create a signed URL for a file (for private buckets)
   * @param objectKey - The file path/key
   * @param expiresIn - Expiration time in seconds (default: 3600 = 1 hour)
   */
  async createSignedUrl(objectKey: string, expiresIn: number = 3600) {
    try {
      const signedUrl = await this.repository.createSignedUrl(
        objectKey,
        expiresIn,
      );
      return {
        success: true,
        url: signedUrl,
      };
    } catch (error) {
      throw new ApiError(
        `Failed to create signed URL: ${(error as Error).message}`,
        500,
      );
    }
  }

  /**
   * Delete a file
   */
  async deleteFile(objectKey: string) {
    try {
      const { error } = await this.repository.deleteFile(objectKey);

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      return {
        success: true,
        message: "File deleted successfully",
      };
    } catch (error) {
      throw new ApiError(
        `Failed to delete file: ${(error as Error).message}`,
        500,
      );
    }
  }

  /**
   * List user files
   */
  async listUserFiles(
    userId: string,
  ): Promise<
    { success: true; files: FileObject[] } | { success: false; error: string }
  > {
    try {
      const { data, error } = await this.repository.listUserFiles(userId);

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      return {
        success: true,
        files: data || [],
      };
    } catch (error) {
      throw new ApiError(
        `Failed to list files: ${(error as Error).message}`,
        500,
      );
    }
  }
}
