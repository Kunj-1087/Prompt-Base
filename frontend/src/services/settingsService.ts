import api from './api';
import type { NotificationPreferences } from '../types/settings';

export const settingsService = {
  updateNotifications: async (prefs: Partial<NotificationPreferences>) => {
    const response = await api.patch('/settings/notifications', prefs);
    return response.data.data;
  },
  
  changePassword: async (data: any) => {
    await api.patch('/settings/password', data);
  },

  getSessions: async () => {
    const response = await api.get('/settings/sessions');
    return response.data.data.sessions;
  },

  exportData: async () => {
    const response = await api.post('/settings/export-data');
    return response.data;
  },

  deleteAccount: async () => {
    await api.delete('/settings/account');
  }
};
