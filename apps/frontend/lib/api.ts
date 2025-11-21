import axios from "axios";
import { getAuthToken } from "./auth";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const healthCheck = async () => {
  const response = await api.get("/health");
  return response.data;
};
