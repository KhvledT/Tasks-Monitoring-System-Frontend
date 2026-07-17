import React from 'react';
import { Navigate, Outlet } from 'react-router';
import { useAuth } from '../shared/hooks/useAuth';
import { PageLoader } from '../shared/components/loading';
import { ROUTES } from '../constants/routes';

export const GuestRoute: React.FC = () => {
  const { isAuthenticated, isCheckingAuth } = useAuth();

  if (isCheckingAuth) {
    return <PageLoader />;
  }

  if (isAuthenticated) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return <Outlet />;
};
export default GuestRoute;
