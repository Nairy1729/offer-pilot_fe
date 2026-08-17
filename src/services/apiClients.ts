import axios, {
  AxiosError,
  type InternalAxiosRequestConfig,
} from "axios";
import { useAuthStore } from "../features/auth/store/authStore";
import type { ApiResponse } from "../types/api.types";
import type { AuthApiPayload } from "../features/auth/types/auth.types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
console.log("API_BASE_URL:", API_BASE_URL);

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

type FailedRequestQueueItem = {
  resolve: (accessToken: string) => void;
  reject: (error: unknown) => void;
};

let isRefreshing = false;
let failedRequestQueue: FailedRequestQueueItem[] = [];

function processFailedRequestQueue(error: unknown, accessToken: string | null) {
  failedRequestQueue.forEach((request) => {
    if (error) {
      request.reject(error);
    } else if (accessToken) {
      request.resolve(accessToken);
    }
  });

  failedRequestQueue = [];
}

export const publicApiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const accessToken = useAuthStore.getState().accessToken;

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    const status = error.response?.status;
    const responseData = error.response?.data as
      | { errorCode?: string }
      | undefined;

    const errorCode = responseData?.errorCode;

    const shouldAttemptRefresh =
      status === 401 ||
      errorCode === "AUTH_EXPIRED_TOKEN" ||
      errorCode === "AUTH_INVALID_TOKEN" ||
      errorCode === "AUTH_UNAUTHORIZED";

    const isAuthEndpoint =
      originalRequest.url?.includes("/api/v1/auth/login") ||
      originalRequest.url?.includes("/api/v1/auth/register") ||
      originalRequest.url?.includes("/api/v1/auth/refresh") ||
      originalRequest.url?.includes("/api/v1/auth/logout");

    if (!shouldAttemptRefresh || originalRequest._retry || isAuthEndpoint) {
      return Promise.reject(error);
    }

    const refreshToken = useAuthStore.getState().refreshToken;

    if (!refreshToken) {
      useAuthStore.getState().clearSession();
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedRequestQueue.push({
          resolve: (newAccessToken: string) => {
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            resolve(apiClient(originalRequest));
          },
          reject,
        });
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const refreshResponse = await publicApiClient.post<
        ApiResponse<AuthApiPayload>
      >("/api/v1/auth/refresh", {
        refreshToken,
      });

      const refreshData = refreshResponse.data.data;

      useAuthStore.getState().updateTokens({
        accessToken: refreshData.accessToken,
        refreshToken: refreshData.refreshToken,
        tokenType: refreshData.tokenType,
        expiresIn: refreshData.expiresIn,
      });

      processFailedRequestQueue(null, refreshData.accessToken);

      originalRequest.headers.Authorization = `Bearer ${refreshData.accessToken}`;

      return apiClient(originalRequest);
    } catch (refreshError) {
      processFailedRequestQueue(refreshError, null);
      useAuthStore.getState().clearSession();

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);
