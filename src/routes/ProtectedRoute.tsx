import React from 'react';
import { Navigate, Outlet } from 'react-router';
import { useAuth } from '../shared/hooks/useAuth';
import { PageLoader } from '../shared/components/loading';
import { ROUTES } from '../constants/routes';
import { useInitializeVessel } from '../features/vessel/hooks/useInitializeVessel';
import { useActiveVessel } from '../shared/hooks/useActiveVessel';

const AuthenticatedWrapper: React.FC = () => {
  useInitializeVessel();
  const { isCheckingVessel } = useActiveVessel();

  if (isCheckingVessel) {
    return <PageLoader />;
  }

  return <Outlet />;
};

export const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, isCheckingAuth } = useAuth();

  if (isCheckingAuth) {
    return <PageLoader />;
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return <AuthenticatedWrapper />;
};
export default ProtectedRoute;
