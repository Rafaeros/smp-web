import { api } from "@/src/core/api/client";
import { AuthResponse, LoginCredentials } from "../types"; // Verifique se o caminho está certo
import { destroyCookie } from "nookies";

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post('/auth/login', credentials);
    return response as unknown as AuthResponse;
  },  

  logout: () => {
    destroyCookie(undefined, 'smp.token', { path: '/' });
    window.location.href = '/login';
  }
};