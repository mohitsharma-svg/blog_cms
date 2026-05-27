import axios from "axios";
import { API_BASE_URL } from "./config";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (original.url === "/auth/refresh") {
      window.location.href = "/login";
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;

      try {
        await api.post("/auth/refresh");

        return api(original);
      } catch {
        window.location.href = "/login";
      }
    }

    if (error.response?.status === 403) {
      window.location.href = "/403";
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export default api;