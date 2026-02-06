import axios, { AxiosError } from "axios";
import { destroyCookie, parseCookies } from "nookies";
import { env } from "../config/env";
import { ApiResponse } from "../types/api";

export const api = axios.create({
  baseURL: env.apiBaseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const cookies = parseCookies();
  const token = cookies["smp.token"];

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => {
    const apiResponse = response.data as ApiResponse;

    if (apiResponse.message && apiResponse.severity === "SUCCESS") {
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("app-toast", {
            detail: {
              message: apiResponse.message,
              severity: "SUCCESS",
            },
          })
        );
      }
    }

    if ("data" in apiResponse || "severity" in apiResponse) {
      return apiResponse.data;
    }

    return response.data;
  },
  (error: AxiosError<ApiResponse>) => {
    const apiError = error.response?.data;

    if (apiError && apiError.message) {
      const severity = apiError.severity || "ERROR";
      const message = apiError.message;

      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("app-toast", {
            detail: { message, severity },
          })
        );
      }
    } else {
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("app-toast", {
            detail: {
              message: "Erro de comunicação com o servidor.",
              severity: "ERROR",
            },
          })
        );
      }
    }

    if (error.response?.status === 401 || error.response?.status === 403) {
      destroyCookie(undefined, "smp.token", { path: "/" });

      if (
        typeof window !== "undefined" &&
        !window.location.pathname.includes("/login")
      ) {
        window.location.href = "/login";
      }
    }

    return Promise.reject(apiError || error);
  }
);