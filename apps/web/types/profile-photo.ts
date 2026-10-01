export interface UploadProfilePhotoResponse {
  message: string;
  key: string;
}

export interface ProfilePhotoStatusResponse {
  hasPhoto: boolean;
  key: string | null;
  url: string | null;
}
