import type { IssueItem } from '../types/issue.types';

export const issueSortService = {
  sortIssuesByDate: (issues: IssueItem[]): IssueItem[] => {
    return [...issues].sort((a, b) => {
      const dateA = new Date(a.issueDate || a.createdAt || 0).getTime();
      const dateB = new Date(b.issueDate || b.createdAt || 0).getTime();
      return dateB - dateA;
    });
  },
};

export default issueSortService;
