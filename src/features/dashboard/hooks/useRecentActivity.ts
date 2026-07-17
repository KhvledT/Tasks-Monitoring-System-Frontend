import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../api/dashboard.api';
import { DASHBOARD_KEYS } from '../../../constants/query-keys/dashboard';
import type { RecentActivityItem } from '../types/dashboard.types';

export const useRecentActivity = (vesselId: string, enabled = true) => {
  return useQuery<RecentActivityItem[]>({
    queryKey: [...DASHBOARD_KEYS.all(), 'recent-activity', vesselId] as const,
    queryFn: async () => {
      const response = await dashboardApi.getRecentActivity(vesselId, 5);
      
      let rawItems: any[] = [];
      if (Array.isArray(response.result)) {
        rawItems = response.result;
      } else if (response.result && typeof response.result === 'object') {
        if (Array.isArray(response.result.docs)) {
          rawItems = response.result.docs;
        } else if (Array.isArray(response.result.data)) {
          rawItems = response.result.data;
        }
      }

      // Map raw backend records to UI RecentActivityItem objects
      return rawItems.map((item: any): RecentActivityItem => {
        const snapshot = item.task_definition_snapshot || {};
        return {
          id: item._id || item.id || String(Math.random()),
          taskTitle: snapshot.title || item.taskTitle || item.title || 'Unknown Task',
          taskGroup: item.task_group || item.taskGroup || 'Daily',
          categoryName: item.categoryName || snapshot.categoryName || undefined,
          status: item.status ?? 'Completed',
          completionDate: item.completion_date || item.completionDate || item.created_at || item.createdAt,
          notes: item.notes || item.note,
        };
      });
    },
    enabled: enabled && !!vesselId,
  });
};
export default useRecentActivity;
