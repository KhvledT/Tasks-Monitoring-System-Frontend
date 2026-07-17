import type { IssueItem } from '../types/issue.types';

export const issueFilterService = {
  filterIssuesBySearch: (issues: IssueItem[], query: string): IssueItem[] => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return issues;

    return issues.filter((issue) => {
      const desc = (issue.description || '').toLowerCase();
      const note = (issue.note || '').toLowerCase();
      const task = (issue.taskTitle || '').toLowerCase();
      return desc.includes(trimmed) || note.includes(trimmed) || task.includes(trimmed);
    });
  },
};

export default issueFilterService;
