import axios from "axios";
import {
  getToken,
  isTokenValid,
  triggerAuthLogout,
  recordActivity,
} from "./authStorage";

const rawBaseUrl =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_BASE_URL) ||
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_URL) ||
  "https://pave-snowy.vercel.app";
const baseURL = rawBaseUrl.replace(/\/api\/v1$/, "");

export const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

const isAuthEndpointUrl = (url?: string) =>
  !!url &&
  (url.includes("/login") ||
    url.includes("/register") ||
    url.includes("/forgot-password") ||
    url.includes("/reset-password"));

// Request interceptor: attach token & validate expiry before sending
api.interceptors.request.use((config) => {
  recordActivity();

  const token = getToken();
  const isAuthEndpoint = isAuthEndpointUrl(config.url);

  if (token) {
    if (!isTokenValid(token)) {
      triggerAuthLogout("token_expired");
      return Promise.reject(
        new axios.Cancel("Session expired. Please log in again."),
      );
    }
    config.headers.Authorization = `Bearer ${token}`;
  } else if (!isAuthEndpoint && config.headers?.Authorization) {
    delete config.headers.Authorization;
  }

  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }

  return config;
});

// Response interceptor.
// Only 401 means "not authenticated". 403 means "not allowed" (this backend even
// uses 403 for "You already had an account..."), so it must NEVER end the session.
// - Auth endpoints are skipped (a wrong password returns 401 and shouldn't redirect).
// - If there is no token, the session is already cleared, so parallel requests
//   that fail afterwards don't trigger another logout.
api.interceptors.response.use(
  (response) => {
    recordActivity();
    return response;
  },
  (error) => {
    const status = error?.response?.status;
    const url: string | undefined = error?.config?.url;

    if (status === 401 && !isAuthEndpointUrl(url) && getToken()) {
      triggerAuthLogout("unauthorized");
    }

    return Promise.reject(error);
  },
);