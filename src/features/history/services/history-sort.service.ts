import type { HistoryItem } from '../types/history.types';

export const historySortService = {
  sortHistoryByDate: (items: HistoryItem[]): HistoryItem[] => {
    return [...items].sort((a, b) => {
      const dateA = new Date(a.issueDate || a.createdAt || 0).getTime();
      const dateB = new Date(b.issueDate || b.createdAt || 0).getTime();
      return dateB - dateA;
    });
  },
};

export default historySortService;
