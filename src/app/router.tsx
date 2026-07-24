import React, { lazy, Suspense } from 'react';
import { Route, Routes, Navigate } from 'react-router';
import { ROUTES } from '../constants/routes';

// Layouts
import { AuthLayout, AppLayout } from '../layouts';

// Guards
import { GuestRoute } from '../routes/GuestRoute';
import { ProtectedRoute } from '../routes/ProtectedRoute';
import { VesselGuard } from '../routes/VesselGuard';
import { RoleGuard } from '../routes/RoleGuard';

// Shared Loaders
import { PageLoader } from '../shared/components/loading';

// Lazy Loaded Auth Pages
const LoginPage = lazy(() => import('../features/auth/pages/LoginPage'));
const SignupPage = lazy(() => import('../features/auth/pages/SignupPage'));
const VerifyEmailPage = lazy(() => import('../features/auth/pages/VerifyEmailPage'));
const ForgotPasswordPage = lazy(() => import('../features/auth/pages/ForgotPasswordPage'));

// Lazy Loaded Core Protected Pages
const WorkspaceHomePage = lazy(() => import('../features/workspaceHome/pages/WorkspaceHomePage'));
const SelectVesselPage = lazy(() => import('../features/vessel/pages/SelectVesselPage'));
const DashboardPage = lazy(() => import('../features/dashboard/pages/DashboardPage'));
const ChecklistsPage = lazy(() => import('../features/checklist/pages/ChecklistsPage'));
const IssuesPage = lazy(() => import('../features/issues/pages/IssuesPage'));
const HistoryPage = lazy(() => import('../features/history/pages/HistoryPage'));
const ProfilePage = lazy(() => import('../features/profile/pages/ProfilePage'));
const ReportsPage = lazy(() => import('../features/reports/pages/ReportsPage'));

// Captain / ADMIN Pages
const CrewPage = lazy(() => import('../features/crew/pages/CrewPage'));
const JoinRequestsPage = lazy(() => import('../features/crew/pages/JoinRequestsPage'));
const QrInvitePage = lazy(() => import('../features/crew/pages/QrInvitePage'));
const TemplatesPage = lazy(() => import('../features/templates/pages/TemplatesPage'));

// SUPER_ADMIN Pages
const UsersManagementPage = lazy(() => import('../features/admin/pages/UsersManagementPage'));
const VipVesselsPage = lazy(() => import('../features/admin/pages/VipVesselsPage'));
const GlobalTemplatesPage = lazy(() => import('../features/admin/pages/GlobalTemplatesPage'));
const HealthCheckPage = lazy(() => import('../features/admin/pages/HealthCheckPage'));

// Shared / Auxiliary Pages
const NotificationsPage = lazy(() => import('../features/notifications/pages/NotificationsPage'));

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
        {/* Shared AppLayout routes (Accessible with or without active vessel selected) */}
        <Route element={<AppLayout />}>
          <Route
            path={ROUTES.SELECT_VESSEL}
            element={
              <Suspense fallback={<PageLoader />}>
                <SelectVesselPage />
              </Suspense>
            }
          />
          <Route
            path={ROUTES.WORKSPACE_HOME}
            element={
              <Suspense fallback={<PageLoader />}>
                <WorkspaceHomePage />
              </Suspense>
            }
          />
          <Route
            path={ROUTES.NOTIFICATIONS}
            element={
              <Suspense fallback={<PageLoader />}>
                <NotificationsPage />
              </Suspense>
            }
          />
        </Route>

        {/* Global Super Admin Management Routes (Does NOT require active vessel selected) */}
        <Route element={<RoleGuard allowedRoles={["SUPER_ADMIN"]} />}>
          <Route element={<AppLayout />}>
            <Route
              path={ROUTES.USERS_MANAGEMENT}
              element={
                <Suspense fallback={<PageLoader />}>
                  <UsersManagementPage />
                </Suspense>
              }
            />
            <Route
              path={ROUTES.VIP_VESSELS}
              element={
                <Suspense fallback={<PageLoader />}>
                  <VipVesselsPage />
                </Suspense>
              }
            />
            <Route
              path={ROUTES.GLOBAL_TEMPLATES}
              element={
                <Suspense fallback={<PageLoader />}>
                  <GlobalTemplatesPage />
                </Suspense>
              }
            />
            <Route
              path={ROUTES.HEALTH_CHECK}
              element={
                <Suspense fallback={<PageLoader />}>
                  <HealthCheckPage />
                </Suspense>
              }
            />
            {/* Legacy Info-Only Pages Redirect to Unified Workspace Home Command Center */}
            <Route path={ROUTES.FLEET_DASHBOARD} element={<Navigate to={ROUTES.WORKSPACE_HOME} replace />} />
            <Route path={ROUTES.ADMIN} element={<Navigate to={ROUTES.WORKSPACE_HOME} replace />} />
          </Route>
        </Route>

        {/* Vessel Guarded Core application routes */}
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
              path={ROUTES.PROFILE}
              element={
                <Suspense fallback={<PageLoader />}>
                  <ProfilePage />
                </Suspense>
              }
            />

            {/* USER Only Guarded Routes (Operational Watchkeeping) */}
            <Route element={<RoleGuard allowedRoles={["USER"]} />}>
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
                path={ROUTES.REPORTS}
                element={
                  <Suspense fallback={<PageLoader />}>
                    <ReportsPage />
                  </Suspense>
                }
              />
            </Route>

            {/* Captain / ADMIN Guarded routes */}
            <Route element={<RoleGuard allowedRoles={["ADMIN", "SUPER_ADMIN"]} />}>
              <Route
                path={ROUTES.CREW}
                element={
                  <Suspense fallback={<PageLoader />}>
                    <CrewPage />
                  </Suspense>
                }
              />
              <Route
                path={ROUTES.CREW_REQUESTS}
                element={
                  <Suspense fallback={<PageLoader />}>
                    <JoinRequestsPage />
                  </Suspense>
                }
              />
              <Route
                path={ROUTES.QR_INVITE}
                element={
                  <Suspense fallback={<PageLoader />}>
                    <QrInvitePage />
                  </Suspense>
                }
              />
              <Route
                path={ROUTES.TEMPLATES}
                element={
                  <Suspense fallback={<PageLoader />}>
                    <TemplatesPage />
                  </Suspense>
                }
              />
            </Route>
          </Route>
        </Route>
      </Route>

      {/* Fallback catches */}
      <Route path="/" element={<Navigate to={ROUTES.WORKSPACE_HOME} replace />} />
      <Route path="*" element={<Navigate to={ROUTES.WORKSPACE_HOME} replace />} />
    </Routes>
  );
};

export default AppRouter;
