import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../api/dashboard.api';
import { DASHBOARD_KEYS } from '../../../constants/query-keys/dashboard';

export const useDashboardMetrics = (vesselId: string, enabled = true) => {
  return useQuery({
    queryKey: DASHBOARD_KEYS.metrics(vesselId),
    queryFn: async () => {
      const response = await dashboardApi.getDashboardMetrics(vesselId);
      return response.result;
    },
    enabled: enabled && !!vesselId,
  });
};
export default useDashboardMetrics;
