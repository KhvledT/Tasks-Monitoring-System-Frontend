export interface DashboardMetrics {
  complianceRate: number;
  completedCount: number;
  pendingCount: number;
  postponedCount: number;
  activeIssues: number;
  activeWatchSession?: {
    id: string;
    status: 'STARTED' | 'ACTIVE' | 'PAUSED' | 'HANDED_OVER' | 'COMPLETED';
    startedAt: string;
    notes: string | null;
  } | null;
}

export interface RecentActivityItem {
  id: string;
  taskTitle: string;
  taskGroup: string;
  categoryName?: string;
  status: string | number;
  completionDate?: string;
  notes?: string;
}

export interface DashboardMetricsResponse {
  statusCode: number;
  message?: string;
  result: DashboardMetrics;
}

export interface RecentActivityResponse {
  statusCode: number;
  message?: string;
  result: any; // Can be array of logs or paginated object with docs
}
