import api from './api';

export interface ISession {
    id: string;
    device: string;
    browser: string;
    os: string;
    location: string;
    ipAddress: string;
    lastActivity: string;
    createdAt: string;
    isCurrent: boolean;
}

export const sessionService = {
  getSessions: async () => {
    const response = await api.get('/sessions');
    return response.data; // Expecting { success: true, data: ISession[] }
  },

  revokeSession: async (id: string) => {
    const response = await api.delete(`/sessions/${id}`);
    return response.data;
  },

  revokeAllSessions: async () => {
    const response = await api.delete('/sessions/all');
    return response.data;
  }
};
