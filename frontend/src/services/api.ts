import axios from 'axios';
import config from '../config/env';
import { storage } from '../utils/storage';

const api = axios.create({
  baseURL: config.API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Add Token
api.interceptors.request.use(
  (config) => {
    const token = storage.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and not retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = storage.getRefreshToken();
        
        if (!refreshToken) {
            throw new Error('No refresh token');
        }

        const { data } = await axios.post(`${config.API_URL}/auth/refresh`, {
          refreshToken,
        });

        if (data.success) {
          storage.setAccessToken(data.data.accessToken);
          api.defaults.headers.common['Authorization'] = `Bearer ${data.data.accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed (expired or invalid), force logout
        storage.clearTokens();
        window.location.href = '/login'; 
      }
    }

    return Promise.reject(error);
  }
);

export default api;
