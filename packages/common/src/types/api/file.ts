export interface FileUploadData {
  file: File;
  userId: string;
}

export interface HeadshotUploadData extends FileUploadData {
  fullName: string;
}

export interface UploadResult {
  success: true;
  key: string;
}

export interface UploadError {
  success: false;
  error: string;
}
