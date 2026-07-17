import React from 'react';
import { Navigate, Outlet } from 'react-router';
import { useActiveVessel } from '../shared/hooks/useActiveVessel';
import { PageLoader } from '../shared/components/loading';
import { ROUTES } from '../constants/routes';

export const VesselGuard: React.FC = () => {
  const { activeVessel, isCheckingVessel } = useActiveVessel();

  if (isCheckingVessel) {
    return <PageLoader />;
  }

  if (!activeVessel) {
    return <Navigate to={ROUTES.SELECT_VESSEL} replace />;
  }

  return <Outlet />;
};
export default VesselGuard;
