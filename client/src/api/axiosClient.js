import axios from "axios";

const RAW_API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const normalizeApiBaseUrl = (url) => {
  const trimmed = (url || "").trim().replace(/\/+$/, "");
  if (!trimmed) return "http://localhost:5000/api";
  return trimmed.endsWith("/api") ? trimmed : `${trimmed}/api`;
};

const API_URL = normalizeApiBaseUrl(RAW_API_URL);

const api = axios.create({
  baseURL: API_URL
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token") || localStorage.getItem("hs_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
