import { useMutation, useQueryClient } from '@tanstack/react-query';
import { issueApi } from '../api/issue.api';
import { ISSUE_KEYS } from '../../../constants/query-keys/issues';
import type { CreateIssueRequest } from '../types/issue.types';

export const useCreateIssue = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateIssueRequest) => issueApi.createIssue(data),
    onSuccess: () => {
      // Invalidate issues lists to trigger refetch
      queryClient.invalidateQueries({ queryKey: ISSUE_KEYS.all() });
    },
  });
};

export default useCreateIssue;
