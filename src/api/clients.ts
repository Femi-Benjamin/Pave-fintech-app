// D.Seek
import axios from "axios";

const defaultBase = import.meta.env.VITE_API_BASE_URL || "https://pave-snowy.vercel.app";
const apiBase = defaultBase.endsWith("/api/v1") ? defaultBase : `${defaultBase}/api/v1`;

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || apiBase,
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: attach token to requests when logged in
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("pave_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
