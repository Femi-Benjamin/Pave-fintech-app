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
    // Only 401 means "not authenticated". 403 means "not allowed" (this backend
    // even uses 403 for "You already had an account..."), so it must NEVER end
    // the session. The getToken() check avoids repeat logouts from parallel
    // requests that fail after the session is already cleared.
    if (status === 401 && getToken()) {
      triggerAuthLogout("unauthorized");
    }
    return Promise.reject(error);
  },
);