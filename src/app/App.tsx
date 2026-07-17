import React from 'react';
import { BrowserRouter } from 'react-router';
import { AppProvider } from '../providers/AppProvider';
import { AppRouter } from './router';
import { ErrorBoundary } from './ErrorBoundary';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ENV } from '../env';
import { Toaster } from 'react-hot-toast';

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <AppProvider>
        <BrowserRouter>
          <AppRouter />
          {/* React Query DevTools only mounted in development mode */}
          {ENV.isDev && <ReactQueryDevtools initialIsOpen={false} />}
          {/* Global toast notification system */}
          <Toaster
            position="top-right"
            toastOptions={{
              className: 'bg-zinc-900 border border-zinc-800 text-zinc-100 rounded-xl text-sm font-medium',
            }}
          />
        </BrowserRouter>
      </AppProvider>
    </ErrorBoundary>
  );
};
export default App;
