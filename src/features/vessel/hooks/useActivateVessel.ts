import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { vesselApi } from '../api/vessel.api';
import { VESSEL_KEYS } from '../../../constants/query-keys/vessel';
import { useActiveVessel } from '../../../shared/hooks/useActiveVessel';
import { ROUTES } from '../../../constants/routes';

export const useActivateVessel = () => {
  const queryClient = useQueryClient();
  const { setActiveVessel } = useActiveVessel();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (vesselId: string) => vesselApi.activateVessel(vesselId),
    onSuccess: async (data, vesselId) => {
      // 1. Invalidate Vessel Query
      queryClient.invalidateQueries({ queryKey: VESSEL_KEYS.list() });

      // 2. Refetch Vessel List (Wait for query resolution)
      const response = await queryClient.fetchQuery({
        queryKey: VESSEL_KEYS.list(),
        queryFn: async () => {
          const res = await vesselApi.getVessels();
          return res.result;
        },
      });

      // 3. Read Updated Active Vessel
      const active =
        response.find((v: any) => v.isActive === true) ||
        response.find((v: any) => String(v._id || v.id) === String(vesselId)) ||
        (data as any)?.result ||
        (data as any);

      // 4. Update VesselProvider
      setActiveVessel((active as any) || null);

      // 5. Navigate Dashboard
      navigate(ROUTES.DASHBOARD, { replace: true });
    },
  });
};
export default useActivateVessel;
