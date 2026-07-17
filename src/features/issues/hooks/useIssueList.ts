import { useQuery } from '@tanstack/react-query';
import { issueApi } from '../api/issue.api';
import { ISSUE_KEYS } from '../../../constants/query-keys/issues';
import { issueMapperService } from '../services/issue-mapper.service';
import type { IssueItem } from '../types/issue.types';

export const useIssueList = (vesselId: string, enabled = true) => {
  return useQuery<IssueItem[]>({
    queryKey: ISSUE_KEYS.list(vesselId),
    queryFn: async () => {
      const response = await issueApi.getIssues(vesselId);
      const rawIssues = Array.isArray(response.result) ? response.result : [];
      return rawIssues.map(issueMapperService.mapToIssueItem);
    },
    enabled: enabled && !!vesselId,
  });
};

export default useIssueList;
