import api from './api';
import type { UserProfileResponse } from '../types/user';

export const userService = {
  getProfile: async (): Promise<UserProfileResponse> => {
    const response = await api.get('/users/me');
    return response.data.data;
  },

  updateProfile: async (data: Partial<UserProfileResponse['profile']> & { name?: string }) => {
    const response = await api.put('/users/me', data);
    return response.data.data;
  },

  updateAvatar: async (avatarUrl: string) => {
    const response = await api.patch('/users/me/avatar', { avatarUrl });
    return response.data.data;
  },
};
