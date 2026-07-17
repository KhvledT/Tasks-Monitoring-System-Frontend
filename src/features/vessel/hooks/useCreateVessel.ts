import { useMutation, useQueryClient } from '@tanstack/react-query';
import { vesselApi } from '../api/vessel.api';
import { VESSEL_KEYS } from '../../../constants/query-keys/vessel';
import type { CreateVesselRequest } from '../types/vessel.types';

export const useCreateVessel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateVesselRequest) => vesselApi.createVessel(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VESSEL_KEYS.list() });
    },
  });
};
