import { useMutation, useQueryClient } from '@tanstack/react-query';
import { vesselApi } from '../api/vessel.api';
import { VESSEL_KEYS } from '../../../constants/query-keys/vessel';
import type { CreateVesselRequest } from '../types/vessel.types';

export const useUpdateVessel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ vesselId, data }: { vesselId: string; data: Partial<CreateVesselRequest> }) =>
      vesselApi.updateVessel(vesselId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VESSEL_KEYS.list() });
    },
  });
};

export default useUpdateVessel;
