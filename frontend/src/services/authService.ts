import api from './api';

export const authService = {
  verifyEmail: async (token: string) => {
    const response = await api.post(`/auth/verify-email/${token}`);
    return response.data;
  },

  resendVerification: async () => {
    const response = await api.post('/auth/resend-verification');
    return response.data;
  },

  setup2FA: async () => {
      const response = await api.post('/2fa/setup');
      return response.data.data;
  },

  verify2FASetup: async (token: string) => {
      const response = await api.post('/2fa/verify-setup', { token });
      return response.data;
  },

  disable2FA: async (token: string) => {
      const response = await api.post('/2fa/disable', { token });
      return response.data;
  }
};
