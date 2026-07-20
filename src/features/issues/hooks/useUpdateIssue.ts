import { useMutation, useQueryClient } from '@tanstack/react-query';
import { issueApi } from '../api/issue.api';
import { ISSUE_KEYS } from '../../../constants/query-keys/issues';
import { CHECKLIST_KEYS } from '../../../constants/query-keys/checklist';

export interface UpdateIssuePayload {
  description?: string;
  note?: string;
  severity?: 'CRITICAL' | 'MAJOR' | 'MINOR' | 'OBSERVATION';
  status?: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  resolutionNotes?: string;
}

export const useUpdateIssue = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ issueId, data }: { issueId: string; data: UpdateIssuePayload }) =>
      issueApi.updateIssue(issueId, data),
    onSuccess: () => {
      // Invalidate issues lists, checklist records, and dashboard metrics on successful update
      queryClient.invalidateQueries({ queryKey: ISSUE_KEYS.all() });
      queryClient.invalidateQueries({ queryKey: CHECKLIST_KEYS.all() });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
};

export default useUpdateIssue;
