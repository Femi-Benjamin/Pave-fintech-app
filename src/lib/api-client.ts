import axios from "axios";

const rawBaseUrl =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  "https://pave-snowy.vercel.app";
const baseURL = rawBaseUrl.replace(/\/api\/v1$/, "");

export const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("pave_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
