import type { HistoryItem } from '../types/history.types';

export interface HistoryMetricsResult {
  completedCount: number;
  postponedCount: number;
  totalCount: number;
}

export const historyMetricsService = {
  calculateTotals: (items: HistoryItem[]): HistoryMetricsResult => {
    let completedCount = 0;
    let postponedCount = 0;

    items.forEach((item) => {
      const status = (item.status || '').toLowerCase();
      if (status === 'completed' || status === '1') {
        completedCount++;
      } else if (status === 'postponed' || status === '2') {
        postponedCount++;
      }
    });

    return {
      completedCount,
      postponedCount,
      totalCount: completedCount + postponedCount,
    };
  },
};

export default historyMetricsService;
