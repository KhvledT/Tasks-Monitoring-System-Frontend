import { useMutation, useQueryClient } from '@tanstack/react-query';
import { checklistApi } from '../api/checklist.api';
import { CHECKLIST_KEYS } from '../../../constants/query-keys/checklist';
import type { PostponeTaskRequest } from '../types/checklist.types';

export const usePostponeTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ recordId, data }: { recordId: string; data: PostponeTaskRequest }) =>
      checklistApi.postponeTask(recordId, data),
    onSuccess: () => {
      // Invalidate all checklist records queries to reload state
      queryClient.invalidateQueries({ queryKey: CHECKLIST_KEYS.all() });
    },
  });
};

export default usePostponeTask;
