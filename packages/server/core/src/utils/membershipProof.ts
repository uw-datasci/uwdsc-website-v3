import { FileValidationConfig } from "@uwdsc/common/types";

/**
 * Get file extension from MIME type
 */
function getExtensionFromMime(mime: string): string | null {
  if (mime === "image/png") return "png";
  if (mime === "image/jpeg") return "jpg";
  if (mime === "image/webp") return "webp";
  if (mime === "application/pdf") return "pdf";
  return null;
}

export const MEMBERSHIP_PROOF_VALIDATION_CONFIG: FileValidationConfig = {
  maxBytes: 10 * 1024 * 1024, // 10 MB
  allowedMimeTypes: new Set(["image/png", "image/jpeg", "image/webp", "application/pdf"]),
  mimeToExtension: getExtensionFromMime,
  customValidation: (file: File) => {
    const ext = getExtensionFromMime(file.type);
    if (ext) return null;

    return {
      valid: false,
      error: "Invalid file type. Allowed: PNG, JPG, WEBP, or PDF.",
    };
  },
};

export { getExtensionFromMime as getProofExtensionFromMime };
