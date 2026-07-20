import { useMutation, useQueryClient } from '@tanstack/react-query';
import { issueApi } from '../api/issue.api';
import { ISSUE_KEYS } from '../../../constants/query-keys/issues';
import { CHECKLIST_KEYS } from '../../../constants/query-keys/checklist';

export const useDeleteIssue = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (issueId: string) => issueApi.deleteIssue(issueId),
    onSuccess: () => {
      // Invalidate issues lists, checklist records, and dashboard metrics on successful deletion
      queryClient.invalidateQueries({ queryKey: ISSUE_KEYS.all() });
      queryClient.invalidateQueries({ queryKey: CHECKLIST_KEYS.all() });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
};

export default useDeleteIssue;
