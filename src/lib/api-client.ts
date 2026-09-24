import axios from "axios";

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:9860";
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
