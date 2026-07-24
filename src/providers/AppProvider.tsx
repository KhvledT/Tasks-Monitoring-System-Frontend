import React from 'react';
import { QueryProvider } from './QueryProvider';
import { ThemeProvider } from './ThemeProvider';
import { AuthProvider } from './AuthProvider';
import { VesselProvider } from './VesselProvider';
import { SocketProvider } from './SocketProvider';

interface AppProviderProps {
  children: React.ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  return (
    <QueryProvider>
      <ThemeProvider>
        <AuthProvider>
          <VesselProvider>
            <SocketProvider>
              {children}
            </SocketProvider>
          </VesselProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryProvider>
  );
};
