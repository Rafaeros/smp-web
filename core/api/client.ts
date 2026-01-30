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
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      destroyCookie(undefined, 'smp.token', { path: '/' });
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);