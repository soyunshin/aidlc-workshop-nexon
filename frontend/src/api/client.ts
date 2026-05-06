import axios from 'axios';
import { getToken, isTokenExpired, clearAuth } from '../utils/token';
import { getCredentials } from '../utils/storage';
import type { AuthToken } from './types';

const apiClient = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach JWT token
apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: handle 401 with auto-reauthentication
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const credentials = getCredentials();
      if (credentials) {
        try {
          const response = await axios.post<AuthToken>('/api/table/login', credentials);
          const { access_token } = response.data;
          localStorage.setItem('auth_token', access_token);
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          return apiClient(originalRequest);
        } catch {
          clearAuth();
          window.location.href = '/setup';
        }
      } else {
        clearAuth();
        window.location.href = '/setup';
      }
    }

    return Promise.reject(error);
  }
);

export { isTokenExpired };
export default apiClient;
