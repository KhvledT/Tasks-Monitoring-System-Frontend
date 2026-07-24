import React from 'react';
import { Outlet } from 'react-router';
import { useActiveVessel } from '../shared/hooks/useActiveVessel';
import { useAuth } from '../shared/hooks/useAuth';
import { PageLoader } from '../shared/components/loading';
import { VesselOperationalGuard } from './VesselOperationalGuard';

export const VesselGuard: React.FC = () => {
  const { isCheckingVessel } = useActiveVessel();
  const { user } = useAuth();

  if (isCheckingVessel) {
    return <PageLoader />;
  }

  // Super Admin does NOT require an active vessel selected
  if (user?.role === 'SUPER_ADMIN') {
    return <Outlet />;
  }

  return (
    <VesselOperationalGuard>
      <Outlet />
    </VesselOperationalGuard>
  );
};
export default VesselGuard;
