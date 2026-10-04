import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false;
let refreshSubscribers: Array<() => void> = [];

const subscribeTokenRefresh = (callback: () => void) => {
  refreshSubscribers.push(callback);
};

const onRefreshed = () => {
  refreshSubscribers.forEach((callback) => callback());
  refreshSubscribers = [];
};

// Endpoints where a 401 means "this request failed" (wrong credentials, no
// session yet) — NOT "my access token expired mid-session." Trying to
// refresh-and-retry on these would be wrong, and for '/auth/refresh'
// specifically, it would deadlock (a failing refresh call waiting on itself).
const AUTH_ENDPOINTS_EXCLUDED_FROM_REFRESH = ['/auth/login', '/auth/register', '/auth/refresh'];

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const isExcluded = AUTH_ENDPOINTS_EXCLUDED_FROM_REFRESH.some((endpoint) =>
      originalRequest?.url?.includes(endpoint)
    );

    if (error.response?.status === 401 && !originalRequest._retry && !isExcluded) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;
        try {
          await apiClient.post('/auth/refresh');
          isRefreshing = false;
          onRefreshed();
        } catch (refreshError) {
          isRefreshing = false;
          refreshSubscribers = [];
          return Promise.reject(refreshError);
        }
      }

      return new Promise((resolve) => {
        subscribeTokenRefresh(() => {
          resolve(apiClient(originalRequest));
        });
      });
    }

    return Promise.reject(error);
  }
);