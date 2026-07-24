import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useVessels } from './useVessels';
import { useActiveVessel } from '../../../shared/hooks/useActiveVessel';
import { useAuth } from '../../../shared/hooks/useAuth';
import { ROUTES } from '../../../constants/routes';

export const useInitializeVessel = () => {
  const { isAuthenticated } = useAuth();
  const { data: vessels, isLoading, error, isSuccess } = useVessels(isAuthenticated);
  const { setActiveVessel, setIsCheckingVessel } = useActiveVessel();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Only run initialization if authenticated
    if (!isAuthenticated) {
      setIsCheckingVessel(false);
      return;
    }

    if (isLoading) {
      setIsCheckingVessel(true);
      return;
    }

    if (isSuccess && Array.isArray(vessels)) {
      const savedId = localStorage.getItem("mtms_active_vessel_id");
      const active =
        vessels.find((v: any) => (v._id || v.id) === savedId) ||
        vessels.find((v: any) => v.isActive === true) ||
        vessels[0] ||
        null;
      
      // Update context state
      setActiveVessel(active || null);
      if (active) {
        localStorage.setItem("mtms_active_vessel_id", active._id || active.id);
      }
      setIsCheckingVessel(false);

      // Redirect root path '/' to Workspace Home landing page
      if (location.pathname === '/') {
        navigate(ROUTES.WORKSPACE_HOME, { replace: true });
      }
    } else if (isSuccess) {
      // In success state but data is not array
      console.warn('Vessels resolved but is not an array:', vessels);
      setActiveVessel(null);
      setIsCheckingVessel(false);
    } else if (error) {
      setActiveVessel(null);
      setIsCheckingVessel(false);
    }
  }, [
    vessels,
    isLoading,
    isSuccess,
    error,
    isAuthenticated,
    location.pathname,
    navigate,
    setActiveVessel,
    setIsCheckingVessel,
  ]);
};
export default useInitializeVessel;
