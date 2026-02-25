import { FileValidationConfig } from "@uwdsc/common/types";

/**
 * Get file extension from MIME type
 */
function getExtensionFromMime(mime: string): string | null {
  if (mime === "application/pdf") return "pdf";
  if (
    mime ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    return "docx";
  }
  if (mime === "application/msword") return "doc";
  return null;
}

export const RESUME_VALIDATION_CONFIG: FileValidationConfig = {
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
    if (ext) return null;

    return {
      valid: false,
      error: "Invalid file type. Allowed: PDF, DOC, or DOCX.",
    };
  },
};
