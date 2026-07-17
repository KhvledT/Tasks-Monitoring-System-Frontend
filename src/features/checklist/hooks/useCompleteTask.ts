import { useMutation, useQueryClient } from '@tanstack/react-query';
import { checklistApi } from '../api/checklist.api';
import { CHECKLIST_KEYS } from '../../../constants/query-keys/checklist';
import type { CompleteTaskRequest } from '../types/checklist.types';

export const useCompleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ recordId, data }: { recordId: string; data: CompleteTaskRequest }) =>
      checklistApi.completeTask(recordId, data),
    onSuccess: () => {
      // Invalidate all checklist records queries to reload state
      queryClient.invalidateQueries({ queryKey: CHECKLIST_KEYS.all() });
    },
  });
};

export default useCompleteTask;
