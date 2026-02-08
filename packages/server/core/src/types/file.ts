export interface FileUploadData {
  file: File;
  userId: string;
}

export interface FileValidationConfig {
  maxBytes: number;
  allowedMimeTypes: Set<string>;
  mimeToExtension?: (mime: string) => string | null;
  customValidation?: (file: File) => { valid: boolean; error?: string } | null;
}

export interface FileUploadOptions {
  file: File;
  userId: string;
  objectKey: string;
  contentType: string;
}
