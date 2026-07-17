import React, { lazy, Suspense } from 'react';
import { Route, Routes, Navigate } from 'react-router';
import { ROUTES } from '../constants/routes';

// Layouts
import { AuthLayout, VesselLayout, AppLayout } from '../layouts';

// Guards
import { GuestRoute } from '../routes/GuestRoute';
import { ProtectedRoute } from '../routes/ProtectedRoute';
import { VesselGuard } from '../routes/VesselGuard';

// Shared Loaders
import { PageLoader } from '../shared/components/loading';

// Lazy Loaded Auth Pages
const LoginPage = lazy(() => import('../features/auth/pages/LoginPage'));
const SignupPage = lazy(() => import('../features/auth/pages/SignupPage'));
const VerifyEmailPage = lazy(() => import('../features/auth/pages/VerifyEmailPage'));

// Statically Loaded Pages
import { SelectVesselPage } from '../features/vessel';
import { DashboardPage } from '../features/dashboard';
import { ChecklistsPage } from '../features/checklist';
import { IssuesPage } from '../features/issues';
import { HistoryPage } from '../features/history';
import { ProfilePage } from '../features/profile';

export const AppRouter: React.FC = () => {
  return (
    <Routes>
      {/* Guest / Unauthenticated routes */}
      <Route element={<GuestRoute />}>
        <Route element={<AuthLayout />}>
          <Route
            path={ROUTES.LOGIN}
            element={
              <Suspense fallback={<PageLoader />}>
                <LoginPage />
              </Suspense>
            }
          />
          <Route
            path={ROUTES.SIGNUP}
            element={
              <Suspense fallback={<PageLoader />}>
                <SignupPage />
              </Suspense>
            }
          />
          <Route
            path={ROUTES.VERIFY_EMAIL}
            element={
              <Suspense fallback={<PageLoader />}>
                <VerifyEmailPage />
              </Suspense>
            }
          />
        </Route>
      </Route>

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        {/* Vessel selection (Requires user, but NO active vessel) */}
        <Route element={<VesselLayout />}>
          <Route path={ROUTES.SELECT_VESSEL} element={<SelectVesselPage />} />
        </Route>

        {/* Core application routes (Requires user AND active vessel) */}
        <Route element={<VesselGuard />}>
          <Route element={<AppLayout />}>
            <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
            <Route path={ROUTES.CHECKLISTS} element={<ChecklistsPage />} />
            <Route path={ROUTES.ISSUES} element={<IssuesPage />} />
            <Route path={ROUTES.HISTORY} element={<HistoryPage />} />
            <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
          </Route>
        </Route>
      </Route>

      {/* Fallback catches */}
      <Route path="/" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
      <Route path="*" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
    </Routes>
  );
};
export default AppRouter;
