export interface RegisterData {
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  emailRedirectTo?: string;
}
