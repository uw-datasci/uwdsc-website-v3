import { FileValidationConfig } from "@uwdsc/common/types";

/**
 * Map MIME type to the desired file extension for headshots.
 */
function getExtensionFromMime(mime: string): string | null {
  if (mime === "image/jpeg" || mime === "image/jpg") return "jpg";
  if (mime === "image/png") return "png";
  if (mime === "image/webp") return "webp";
  return null;
}

export const HEADSHOT_VALIDATION_CONFIG: FileValidationConfig = {
  maxBytes: 5 * 1024 * 1024, // 5 MB
  allowedMimeTypes: new Set([
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
  ]),
  mimeToExtension: getExtensionFromMime,
  customValidation: (file: File) => {
    const ext = getExtensionFromMime(file.type);
    if (ext) return null;

    return {
      valid: false,
      error: "Invalid file type. Allowed: JPG, PNG, or WEBP.",
    };
  },
};
