export interface UploadProfilePhotoResponse {
  message: string;
  key: string;
  url: string | null;
}

export interface ProfilePhotoStatusResponse {
  hasPhoto: boolean;
  url: string | null;
}
