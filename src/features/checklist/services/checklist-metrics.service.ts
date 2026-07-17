import type { ChecklistCategoryGroup, ChecklistTask } from '../types/checklist.types';

export interface CategoryProgress {
  completedCount: number;
  totalCount: number;
  isCompleted: boolean;
}

export interface ChecklistProgress {
  completedCount: number;
  pendingCount: number;
  postponedCount: number;
  totalCount: number;
  complianceRate: number;
}

export const checklistMetricsService = {
  calculateCategoryProgress: (tasks: ChecklistTask[]): CategoryProgress => {
    const totalCount = tasks.length;
    const completedCount = tasks.filter(
      (t) => String(t.status ?? '').toLowerCase() === 'completed'
    ).length;

    return {
      completedCount,
      totalCount,
      isCompleted: totalCount > 0 && completedCount === totalCount,
    };
  },

  calculateChecklistProgress: (categories: ChecklistCategoryGroup[]): ChecklistProgress => {
    let completedCount = 0;
    let pendingCount = 0;
    let postponedCount = 0;

    categories.forEach((catGroup) => {
      catGroup.tasks.forEach((task) => {
        const status = String(task.status ?? '').toLowerCase();
        if (status === 'completed') {
          completedCount++;
        } else if (status === 'postponed') {
          postponedCount++;
        } else {
          pendingCount++;
        }
      });
    });

    const totalCount = completedCount + pendingCount + postponedCount;
    const complianceRate = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

    return {
      completedCount,
      pendingCount,
      postponedCount,
      totalCount,
      complianceRate,
    };
  },
};

export default checklistMetricsService;
