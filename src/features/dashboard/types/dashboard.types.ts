export interface DashboardMetrics {
  complianceRate: number;
  completedCount: number;
  pendingCount: number;
  postponedCount: number;
  activeIssues: number;
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
