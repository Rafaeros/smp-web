export interface AuthResponse {
  token: string;
  id: number;
  username: string;
  role: string;
}

export interface AuthRequest {
  username: string;
  password: string;
}