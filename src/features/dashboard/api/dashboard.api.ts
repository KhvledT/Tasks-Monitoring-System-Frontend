import { apiClient } from '../../../lib/axios';
import type { DashboardMetricsResponse, RecentActivityResponse } from '../types/dashboard.types';

export const dashboardApi = {
  getDashboardMetrics: async (vesselId: string): Promise<DashboardMetricsResponse> => {
    const response = await apiClient.get<DashboardMetricsResponse>('/dashboard', {
      params: { vesselId },
    });
    return response.data;
  },

  getRecentActivity: async (vesselId: string, limit = 5): Promise<RecentActivityResponse> => {
    const response = await apiClient.get<RecentActivityResponse>('/history', {
      params: { vesselId, limit },
    });
    return response.data;
  },
};
export default dashboardApi;
