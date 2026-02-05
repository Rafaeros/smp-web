import axios from 'axios';
import { destroyCookie, parseCookies } from 'nookies';
import { env } from '../config/env';

export const api = axios.create({
  baseURL: env.apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const cookies = parseCookies();
  const token = cookies['smp.token'];

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const data = error.response?.data;

    if (data && data.message) {
      const severity = data.severity || "ERROR";
      const message = data.message;

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent("app-toast", { 
          detail: { message, severity } 
        }));
      }
    }

    if (error.response?.status === 401 || error.response?.status === 403) {
      destroyCookie(undefined, 'smp.token', { path: '/' });
      
      if (typeof window !== 'undefined') {
        const currentPath = window.location.pathname;
        if (currentPath !== '/' && currentPath !== '/login') {
             window.location.href = '/login';
        }
      }
    }

    return Promise.reject(error);
  }
);