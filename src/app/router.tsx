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
const ForgotPasswordPage = lazy(() => import('../features/auth/pages/ForgotPasswordPage'));

// Lazy Loaded Core Protected Pages
const SelectVesselPage = lazy(() => import('../features/vessel/pages/SelectVesselPage'));
const DashboardPage = lazy(() => import('../features/dashboard/pages/DashboardPage'));
const ChecklistsPage = lazy(() => import('../features/checklist/pages/ChecklistsPage'));
const IssuesPage = lazy(() => import('../features/issues/pages/IssuesPage'));
const HistoryPage = lazy(() => import('../features/history/pages/HistoryPage'));
const ProfilePage = lazy(() => import('../features/profile/pages/ProfilePage'));
const ReportsPage = lazy(() => import('../features/reports/pages/ReportsPage'));

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
          <Route
            path={ROUTES.FORGOT_PASSWORD}
            element={
              <Suspense fallback={<PageLoader />}>
                <ForgotPasswordPage />
              </Suspense>
            }
          />
        </Route>
      </Route>

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        {/* Vessel selection (Requires user, but NO active vessel) */}
        <Route element={<VesselLayout />}>
          <Route
            path={ROUTES.SELECT_VESSEL}
            element={
              <Suspense fallback={<PageLoader />}>
                <SelectVesselPage />
              </Suspense>
            }
          />
        </Route>

        {/* Core application routes (Requires user AND active vessel) */}
        <Route element={<VesselGuard />}>
          <Route element={<AppLayout />}>
            <Route
              path={ROUTES.DASHBOARD}
              element={
                <Suspense fallback={<PageLoader />}>
                  <DashboardPage />
                </Suspense>
              }
            />
            <Route
              path={ROUTES.CHECKLISTS}
              element={
                <Suspense fallback={<PageLoader />}>
                  <ChecklistsPage />
                </Suspense>
              }
            />
            <Route
              path={ROUTES.ISSUES}
              element={
                <Suspense fallback={<PageLoader />}>
                  <IssuesPage />
                </Suspense>
              }
            />
            <Route
              path={ROUTES.HISTORY}
              element={
                <Suspense fallback={<PageLoader />}>
                  <HistoryPage />
                </Suspense>
              }
            />
            <Route
              path={ROUTES.PROFILE}
              element={
                <Suspense fallback={<PageLoader />}>
                  <ProfilePage />
                </Suspense>
              }
            />
            <Route
              path={ROUTES.REPORTS}
              element={
                <Suspense fallback={<PageLoader />}>
                  <ReportsPage />
                </Suspense>
              }
            />
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
