export interface User {
  id?: number;
  username: string;
  name?: string;
  gender?: string;
  birthDate?: Date;
  email?: string;
  password: string;
  role: string;
  province?: string;
  district?: string;
  ward?: string;
  grade?: number;
  educationLevel?: string;
  accountType: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  isNewUser: string;
}
