import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import api from '../services/api';
import { storage, type AuthTokens } from '../utils/storage';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  emailVerified: boolean;
  twoFactorEnabled?: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (tokens: AuthTokens, user: User) => void;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = storage.getToken();
      if (token) {
        try {
          const { data } = await api.get('/users/me');
          if (data.success) {
            setUser(data.data.user);
          }
        } catch (error) {
          // Token invalid, clear it
          storage.clearTokens();
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = (tokens: AuthTokens, userData: User) => {
    storage.setTokens(tokens);
    setUser(userData);
  };

  const logout = async () => {
     try {
        const refreshToken = storage.getRefreshToken();
        if (refreshToken) {
            await api.post('/auth/logout', { refreshToken });
        }
     } catch (error) {
         console.error("Logout failed", error);
     } finally {
        storage.clearTokens();
        setUser(null);
     }
  };

  const updateUser = (userData: User) => {
      setUser(userData);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      isAdmin: user?.role === 'admin',
      isLoading, 
      login, 
      logout,
      updateUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
