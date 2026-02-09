import { api } from "@/src/core/api/client";
import { destroyCookie, setCookie } from "nookies";
import { AuthRequest, AuthResponse } from "../types";

export const authService = {
  async login(credentials: AuthRequest): Promise<AuthResponse> {
    const data = await api.post<AuthResponse>("/auth/login", credentials);
    const userAuth = data as unknown as AuthResponse;
    setCookie(undefined, "smp.token", userAuth.token, {
      maxAge: 60 * 60 * 8,
      path: "/",
    });
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "smp.user",
        JSON.stringify({
          name: userAuth.username,
          role: userAuth.role,
        }),
      );
    }

    return userAuth;
  },

  logout: () => {
    destroyCookie(undefined, 'smp.token', { path: '/' });
    localStorage.removeItem('smp.user');
    window.location.href = '/login';
  }
};
