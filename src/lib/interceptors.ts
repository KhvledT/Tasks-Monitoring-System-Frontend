import axios from 'axios';
import { apiClient } from './axios';
import { getRefreshToken } from './token';
import { ENV } from '../env';

let memoryAccessToken: string | null = null;
let logoutHandler: (() => void) | null = null;

export const setMemoryToken = (token: string | null) => {
  memoryAccessToken = token;
};

export const getMemoryToken = () => memoryAccessToken;

export const registerLogoutHandler = (handler: () => void) => {
  logoutHandler = handler;
  return () => {
    if (logoutHandler === handler) {
      logoutHandler = null;
    }
  };
};

const handleLogout = () => {
  if (logoutHandler) {
    logoutHandler();
  }
};

// Request Interceptor: Inject Authorization header
apiClient.interceptors.request.use(
  (config) => {
    if (memoryAccessToken && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${memoryAccessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle Token Refresh Rotation on 401
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (token) {
      prom.resolve(token);
    } else {
      prom.reject(error);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Guard to ensure request failed with 401 and was not already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        isRefreshing = false;
        handleLogout();
        return Promise.reject(error);
      }

      try {
        // Direct POST refresh API request bypassing the local client instance
        const response = await axios.post(`${ENV.apiUrl}/auth/refresh`, {
          refreshToken,
        });

        // The user_api_reference documents the success response field structure:
        // result: { access_Token: "..." }
        const newAccessToken = response.data?.result?.access_Token;
        if (!newAccessToken) {
          throw new Error('Refresh token response missing access token');
        }
        
        setMemoryToken(newAccessToken);
        processQueue(null, newAccessToken);
        
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        isRefreshing = false;
        
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        isRefreshing = false;
        handleLogout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
