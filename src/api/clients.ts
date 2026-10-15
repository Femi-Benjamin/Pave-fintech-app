import axios from "axios";
import {
  getToken,
  isTokenValid,
  triggerAuthLogout,
  recordActivity,
} from "../lib/authStorage";

const defaultBase =
  import.meta.env.VITE_API_BASE_URL || "https://pave-snowy.vercel.app";
const apiBase = defaultBase.endsWith("/api/v1")
  ? defaultBase
  : `${defaultBase}/api/v1`;

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || apiBase,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  recordActivity();
  const token = getToken();
  if (token) {
    if (!isTokenValid(token)) {
      triggerAuthLogout("token_expired");
      return Promise.reject(
        new axios.Cancel("Session expired. Please log in again."),
      );
    }
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => {
    recordActivity();
    return response;
  },
  (error) => {
    const status = error?.response?.status;
    if (status === 401 || status === 403) {
      triggerAuthLogout("unauthorized");
    }
    return Promise.reject(error);
  },
);
