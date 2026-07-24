import { useQuery } from '@tanstack/react-query';
import { vesselApi } from '../api/vessel.api';
import { VESSEL_KEYS } from '../../../constants/query-keys/vessel';

export const useVessels = (enabled = true) => {
  return useQuery({
    queryKey: VESSEL_KEYS.list(),
    queryFn: async () => {
      const response = await vesselApi.getVessels();
      return response.result;
    },
    enabled,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
};
