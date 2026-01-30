import { api } from "@/core/api/client";
import { AuthResponse, LoginCredentials } from "../types";
import { destroyCookie } from "nookies";

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/auth/login', credentials);
    return data;
  },  
  logout: () => {
    destroyCookie(undefined, 'smp.token', { path: '/' });
    window.location.href = '/login';
  }
};