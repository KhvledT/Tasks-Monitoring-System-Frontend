import React, { createContext, useEffect, useState } from 'react';
import { apiClient } from '../lib/axios';
import { clearRefreshToken, setRefreshToken, getRefreshToken } from '../lib/token';
import { setMemoryToken, registerLogoutHandler } from '../lib/interceptors';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'USER' | 'ADMIN' | 'SUPER_ADMIN';
  rank?: string;
  signOnDate?: string;
  isActive: boolean;
  isVerified: boolean;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isCheckingAuth: boolean;
  login: (accessToken: string, refreshToken: string, user: User) => void;
  logout: () => void;
  updateUser: (user: User) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true);

  const login = (accessToken: string, refreshToken: string, loggedInUser: User) => {
    setMemoryToken(accessToken);
    setRefreshToken(refreshToken);
    setUser(loggedInUser);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setMemoryToken(null);
    clearRefreshToken();
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  // Register the Axios token-expired global logout handler
  useEffect(() => {
    const cleanup = registerLogoutHandler(() => {
      logout();
    });
    return cleanup;
  }, []);

  // Initialize and check user session on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const token = getRefreshToken();
      if (!token) {
        setIsCheckingAuth(false);
        return;
      }

      try {
        // Fetch current profile. If memory token is empty, Axios interceptor 
        // will automatically refresh it and replay this request.
        const response = await apiClient.get('/auth/me');
        const profile = response.data.result;
        
        setUser(profile);
        setIsAuthenticated(true);
      } catch (error) {
        // If profile fetch fails (e.g. token expired and refresh failed), 
        // Axios interceptor will have already logged us out.
        console.error('Failed to restore session:', error);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    initializeAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isCheckingAuth,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
