import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";

import { config } from "./config";

interface ApiErrorResponse {
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
}

function getTokenFromCookie(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|;\s*)auth_token_client=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

const apiClient: AxiosInstance = axios.create({
  baseURL: config.apiBaseUrl,
  timeout: 30000,
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use(
  (requestConfig) => {
    const token = getTokenFromCookie();
    if (token) {
      requestConfig.headers.Authorization = `Bearer ${token}`;
    }
    return requestConfig;
  },
  (error: AxiosError) => Promise.reject(error),
);

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError<ApiErrorResponse>) => {
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;
      let message = "An error occurred";

      if (data?.message) message = data.message;
      else if (data?.error) message = data.error;
      else if (data?.errors) {
        const firstError = Object.values(data.errors)[0];
        if (Array.isArray(firstError) && firstError.length > 0) {
          message = firstError[0];
        }
      }

      switch (status) {
        case 401:
          message = message || "Session expired. Please login again.";
          break;
        case 403:
          message = message || "Access denied.";
          break;
        case 404:
          message = message || "Resource not found.";
          break;
        case 422:
          message = message || "Validation error.";
          break;
        case 500:
          message = message || "Server error. Please try again later.";
          break;
      }

      const apiError = new Error(message) as Error & {
        status: number;
        data: ApiErrorResponse | undefined;
      };
      apiError.status = status;
      apiError.data = data;

      return Promise.reject(apiError);
    }

    if (error.request) {
      return Promise.reject(new Error("Network error. Please check your connection."));
    }

    return Promise.reject(error);
  },
);

export default apiClient;
