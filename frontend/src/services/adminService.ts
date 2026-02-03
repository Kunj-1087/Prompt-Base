import api from './api';
import type { IUser } from '../types/user';

export const adminService = {
  getAllUsers: async (): Promise<IUser[]> => {
    const response = await api.get('/admin/users');
    return response.data.data.users;
  },

  updateUserRole: async (userId: string, role: 'user' | 'admin'): Promise<IUser> => {
    const response = await api.put(`/admin/users/${userId}/role`, { role });
    return response.data.data.user;
  },

  deleteUser: async (userId: string): Promise<void> => {
    await api.delete(`/admin/users/${userId}`);
  },
};
