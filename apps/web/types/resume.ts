export interface UploadResumeResponse {
  message: string;
  key: string;
}

export interface ResumeStatusResponse {
  hasResume: boolean;
  url: string | null;
}
