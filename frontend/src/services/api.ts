import axios from "axios";

const baseURL =
  (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/+$/, "") ||
  "/api";

export const api = axios.create({
  baseURL,
  withCredentials: true, // ative se usar cookies/sessão
});

// opcional: anexa token salvo no localStorage
api.interceptors.request.use((config) => {
  try {
    const raw = localStorage.getItem("auth");
    if (raw) {
      const { token } = JSON.parse(raw);
      if (token) config.headers.Authorization = `Bearer ${token}`;
    }
  } catch {
    console.error("Failed to parse auth token from localStorage");
  }
  return config;
});