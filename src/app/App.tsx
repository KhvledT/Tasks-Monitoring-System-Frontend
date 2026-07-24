import React from "react";
import { BrowserRouter } from "react-router";
import { AppProvider } from "../providers/AppProvider";
import { AppRouter } from "./router";
import { ErrorBoundary } from "./ErrorBoundary";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ENV } from "../env";
import { Toaster } from "react-hot-toast";

import { useDocumentTitle } from "../shared/hooks/useDocumentTitle";
import { ScrollToTop } from "../shared/components/layout/ScrollToTop";
import { OfflineBanner } from "../shared/components/layout/OfflineBanner";
import { ToasterLimit } from "../shared/components/layout/ToasterLimit";

const AppUtilities: React.FC = () => {
  useDocumentTitle();
  return (
    <>
      <ScrollToTop />
      <OfflineBanner />
      <ToasterLimit />
    </>
  );
};

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <AppProvider>
        <BrowserRouter>
          <AppUtilities />
          <AppRouter />
          {/* React Query DevTools only mounted in development mode */}
          {ENV.isDev && <ReactQueryDevtools initialIsOpen={false} />}
          {/* Global toast notification system */}
          <Toaster
            position="top-right"
            toastOptions={{
              className:
                "bg-white border border-zinc-200 text-gray-800 rounded-xl text-sm font-semibold shadow-sm",
            }}
          />
        </BrowserRouter>
      </AppProvider>
    </ErrorBoundary>
  );
};
export default App;
