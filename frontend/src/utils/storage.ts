export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

const ACCESS_TOKEN_KEY = 'pb_access_token';
const REFRESH_TOKEN_KEY = 'pb_refresh_token';

export const storage = {
  getToken: () => localStorage.getItem(ACCESS_TOKEN_KEY),
  
  getRefreshToken: () => localStorage.getItem(REFRESH_TOKEN_KEY),
  
  setTokens: (tokens: AuthTokens) => {
    localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
  },
  
  clearTokens: () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },

  setAccessToken: (token: string) => {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
  }
};
