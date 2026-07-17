import { useQuery } from '@tanstack/react-query';
import { issueApi } from '../api/issue.api';
import type { AvailableTaskOption } from '../types/issue.types';

export const useIssueTaskSelection = (vesselId: string, enabled = true) => {
  // Format today's date as YYYY-MM-DD
  const getTodayString = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const todayStr = getTodayString();

  return useQuery<AvailableTaskOption[]>({
    queryKey: ['task-options-for-issues', vesselId, todayStr],
    queryFn: async () => {
      const response = await issueApi.getChecklistRecords(vesselId, todayStr);
      const rawResult = response.result || [];
      const options: AvailableTaskOption[] = [];

      if (Array.isArray(rawResult)) {
        if (rawResult.length > 0 && 'category' in rawResult[0] && Array.isArray(rawResult[0].tasks)) {
          // Nested categories format
          rawResult.forEach((catGroup: any) => {
            const categoryName = catGroup.category?.name || 'General';
            const tasks = catGroup.tasks || [];
            tasks.forEach((task: any) => {
              const snapshot = task.task_definition_snapshot || {};
              options.push({
                id: task._id || task.id,
                title: snapshot.title || task.title || 'Unknown Task',
                categoryName,
                status: task.status ?? 'Pending',
              });
            });
          });
        } else {
          // Flat list format
          rawResult.forEach((task: any) => {
            const snapshot = task.task_definition_snapshot || {};
            options.push({
              id: task._id || task.id,
              title: snapshot.title || task.title || 'Unknown Task',
              categoryName: snapshot.categoryName || task.categoryName || 'General',
              status: task.status ?? 'Pending',
            });
          });
        }
      }

      return options;
    },
    enabled: enabled && !!vesselId,
  });
};

export default useIssueTaskSelection;
