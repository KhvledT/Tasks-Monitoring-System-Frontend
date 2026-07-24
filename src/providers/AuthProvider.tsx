import React, { createContext, useEffect, useState } from 'react';
import axios from 'axios';
import { apiClient } from '../lib/axios';
import { clearRefreshToken, setRefreshToken, getRefreshToken, getAccessToken, isTokenExpired } from '../lib/token';
import { setMemoryToken, registerLogoutHandler } from '../lib/interceptors';
import { ENV } from '../env';

export interface UserSettings {
  dailyRenewalTime?: string;
  weeklyRenewalDay?: number;
  monthlyRenewalDay?: number;
  notificationsEnabled?: boolean;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'USER' | 'ADMIN' | 'SUPER_ADMIN';
  rank?: string;
  signOnDate?: string;
  isActive: boolean;
  isVerified: boolean;
  settings?: UserSettings;
  avatarUrl?: string;
  phone?: string;
  company?: string;
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

  const updateUser = (updatedUser: Partial<User> | any) => {
    setUser((prev) => {
      const normalized: User = {
        id: String(updatedUser.id || updatedUser._id || prev?.id || ''),
        email: updatedUser.email || prev?.email || '',
        fullName: updatedUser.fullName || prev?.fullName || '',
        role: updatedUser.role || prev?.role || 'USER',
        rank: updatedUser.rank || prev?.rank || '',
        signOnDate: updatedUser.signOnDate || prev?.signOnDate || '',
        isActive: updatedUser.isActive !== undefined ? updatedUser.isActive : prev?.isActive ?? true,
        isVerified: updatedUser.isVerified !== undefined ? updatedUser.isVerified : prev?.isVerified ?? true,
        avatarUrl: updatedUser.avatarUrl !== undefined ? updatedUser.avatarUrl : prev?.avatarUrl || '',
        phone: updatedUser.phone !== undefined ? updatedUser.phone : prev?.phone || '',
        company: updatedUser.company !== undefined ? updatedUser.company : prev?.company || '',
        settings: updatedUser.settings || prev?.settings || {},
      };
      return normalized;
    });
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
      const refreshToken = getRefreshToken();
      const accessToken = getAccessToken();

      if (!refreshToken) {
        setIsCheckingAuth(false);
        return;
      }

      // Check if access token exists and is valid
      const isExpired = isTokenExpired(accessToken);

      if (isExpired) {
        // If expired or missing but we have a refresh token, let's refresh FIRST
        try {
          const response = await axios.post(`${ENV.apiUrl}/auth/refresh`, {
            refreshToken,
          });
          const newAccessToken = response.data?.result?.access_Token;
          if (newAccessToken) {
            setMemoryToken(newAccessToken);
          } else {
            throw new Error('Refresh response missing token');
          }
        } catch (refreshErr) {
          console.error('Failed to auto-refresh token on initialize:', refreshErr);
          logout();
          setIsCheckingAuth(false);
          return;
        }
      }

      // Now we are guaranteed to have a valid access token
      try {
        const response = await apiClient.get('/auth/me');
        const profile = response.data.result;
        
        if (profile) {
          setUser({
            ...profile,
            id: profile.id || profile._id,
            avatarUrl: profile.avatarUrl || '',
          });
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Failed to retrieve profile:', error);
        logout();
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
