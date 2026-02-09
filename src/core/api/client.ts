import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { destroyCookie, parseCookies, setCookie } from "nookies";
import { env } from "../config/env";
import { ApiResponse, Severity } from "../types/api";

declare module 'axios' {
  export interface AxiosRequestConfig {
    flash?: boolean;
  }
}

const dispatchToast = (message: string, severity: Severity) => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("app-toast", {
        detail: { message, severity },
      }),
    );
  }
};

const setFlashMessage = (message: string, severity: Severity) => {
  setCookie(null, "smp.flash", JSON.stringify({ message, severity }), {
    maxAge: 5,
    path: "/",
  });
};

export const api = axios.create({
  baseURL: env.apiBaseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const cookies = parseCookies();
  const token = cookies["smp.token"];

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => {
    const apiResponse = response.data as ApiResponse;
    
    // Check if flash is enabled in config OR if it is a login request
    const shouldUseFlash = response.config.flash || response.config.url?.includes("/auth/login");

    if (apiResponse.message && apiResponse.severity === "SUCCESS") {
      if (shouldUseFlash) {
        setFlashMessage(apiResponse.message, "SUCCESS");
      } else {
        dispatchToast(apiResponse.message, "SUCCESS");
      }
    }

    if ("data" in apiResponse) {
      return apiResponse.data;
    }

    return apiResponse;
  },
  (error: AxiosError<ApiResponse>) => {
    const status = error.response?.status;
    const apiError = error.response?.data;
    const message = apiError?.message || "An unexpected error occurred.";
    const severity = apiError?.severity || "ERROR";

    // Critical Server Errors
    if (!status || status >= 500) {
      if (typeof window !== "undefined") {
        window.location.href = "/error";
      }
      return Promise.reject(error);
    }

    // Unauthorized (Logout)
    if (status === 401) {
      destroyCookie(undefined, "smp.token", { path: "/" });

      if (
        typeof window !== "undefined" &&
        !window.location.pathname.includes("/login")
      ) {
        window.location.href = "/login";
      }
      return Promise.reject(apiError || error);
    }

    // Business Logic Errors / Forbidden
    dispatchToast(message, severity);

    return Promise.reject(apiError || error);
  },
);