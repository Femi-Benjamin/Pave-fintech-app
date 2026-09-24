// D.Seek
import axios from "axios";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:9860/api/v1",
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
