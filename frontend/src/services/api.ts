import axios from 'axios';
import config from '../config/env';
import { storage } from '../utils/storage';
import toast from 'react-hot-toast';

const api = axios.create({
  baseURL: config.API_URL,
  withCredentials: true,
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

    // Handle 401 Unauthorized
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
        storage.clearTokens();
        window.location.href = '/login'; 
      }
    }

    // Global Error Toaster
    const message = error.response?.data?.message || error.message || 'Something went wrong';
    
    // Avoid double showing toasts if handled locally, but usually good to show
    // We can filter out 401s if we want since we redirect.
    if (error.response?.status !== 401) {
        toast.error(message);
    }

    return Promise.reject(error);
  }
);

export default api;
