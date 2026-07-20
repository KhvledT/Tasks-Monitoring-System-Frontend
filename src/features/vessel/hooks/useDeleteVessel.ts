import { useMutation, useQueryClient } from '@tanstack/react-query';
import { vesselApi } from '../api/vessel.api';
import { VESSEL_KEYS } from '../../../constants/query-keys/vessel';

export const useDeleteVessel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (vesselId: string) => vesselApi.deleteVessel(vesselId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VESSEL_KEYS.list() });
    },
  });
};

export default useDeleteVessel;
