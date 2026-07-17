import { useActiveVessel } from '../../../shared/hooks/useActiveVessel';
import { useDashboardMetrics } from './useDashboardMetrics';
import { useRecentActivity } from './useRecentActivity';
import type { DashboardMetrics, RecentActivityItem } from '../types/dashboard.types';

export interface UseDashboardResult {
  metrics: DashboardMetrics | undefined;
  recentActivity: RecentActivityItem[];
  isLoading: boolean;
  error: Error | null;
  isEmpty: boolean;
  activeVesselName: string;
}

export const useDashboard = (): UseDashboardResult => {
  const { activeVessel, activeVesselId } = useActiveVessel();
  const vesselId = activeVesselId || '';

  const {
    data: metrics,
    isLoading: isMetricsLoading,
    error: metricsError,
  } = useDashboardMetrics(vesselId, !!vesselId);

  const {
    data: recentActivity = [],
    isLoading: isActivityLoading,
    error: activityError,
  } = useRecentActivity(vesselId, !!vesselId);

  const isLoading = !vesselId || isMetricsLoading || isActivityLoading;
  
  const rawError = metricsError || activityError;
  const error = rawError ? (rawError instanceof Error ? rawError : new Error(String(rawError))) : null;

  // Determine if the dashboard is in an empty state:
  // e.g. metrics response is zero/empty and recent activity logs list is empty
  const hasNoActivity = recentActivity.length === 0;
  const hasNoMetrics = !metrics || (
    metrics.completedCount === 0 &&
    metrics.pendingCount === 0 &&
    metrics.postponedCount === 0 &&
    metrics.activeIssues === 0
  );
  
  const isEmpty = !isLoading && !error && hasNoActivity && hasNoMetrics;

  return {
    metrics,
    recentActivity,
    isLoading,
    error,
    isEmpty,
    activeVesselName: activeVessel?.name || 'No Vessel Selected',
  };
};

export default useDashboard;
