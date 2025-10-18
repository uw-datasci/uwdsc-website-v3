import type { SupabaseClient } from "@supabase/supabase-js";
import { FileService, FileValidationConfig } from "./fileService";
import type { FileUploadData } from "./fileService";

export type ResumeUploadData = FileUploadData;

/**
 * Get file extension from MIME type
 */
function getExtensionFromMime(mime: string): string | null {
  if (mime === "application/pdf") return "pdf";
  if (
    mime ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  )
    return "docx";
  if (mime === "application/msword") return "doc";
  return null;
}

const RESUME_VALIDATION_CONFIG: FileValidationConfig = {
  maxBytes: 10 * 1024 * 1024, // 10 MB
  allowedMimeTypes: new Set([
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
    "application/msword", // .doc
  ]),
  mimeToExtension: getExtensionFromMime,
  customValidation: (file: File) => {
    // Additional resume-specific validation
    const ext = getExtensionFromMime(file.type);
    if (!ext) {
      return {
        valid: false,
        error: "Invalid file type. Allowed: PDF, DOC, or DOCX.",
      };
    }
    return null;
  },
};

export class ResumeService extends FileService {
  constructor(
    supabaseClient: SupabaseClient,
    validationConfig: FileValidationConfig = RESUME_VALIDATION_CONFIG
  ) {
    super(supabaseClient, "resumes", validationConfig);
  }

  /**
   * Upload a resume file
   */
  async uploadResume(uploadData: ResumeUploadData) {
    return this.uploadFile(uploadData);
  }

  /**
   * Get resume URL
   */
  async getResumeUrl(objectKey: string) {
    return this.getFileUrl(objectKey);
  }

  /**
   * Delete a resume
   */
  async deleteResume(objectKey: string) {
    return this.deleteFile(objectKey);
  }

  /**
   * List user resumes
   */
  async listUserResumes(
    userId: string
  ): Promise<
    { success: true; resumes: any[] } | { success: false; error: string }
  > {
    const result = await this.listUserFiles(userId);

    // Transform the generic response to resume-specific format
    if (result.success) {
      return {
        success: true,
        resumes: result.files,
      };
    }

    return result;
  }
}
