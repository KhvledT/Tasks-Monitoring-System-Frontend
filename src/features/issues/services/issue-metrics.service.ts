import type { IssueItem } from '../types/issue.types';

export const issueMetricsService = {
  calculateIssueCount: (issues: IssueItem[]): number => {
    return issues.length;
  },

  groupIssuesByTask: (issues: IssueItem[]): Record<string, IssueItem[]> => {
    const groups: Record<string, IssueItem[]> = {};
    issues.forEach((issue) => {
      const task = issue.taskTitle || 'Unknown Task';
      if (!groups[task]) {
        groups[task] = [];
      }
      groups[task].push(issue);
    });
    return groups;
  },
};

export default issueMetricsService;
