import { useQuery } from '@tanstack/react-query';
import { useActiveVessel } from '../../../shared/hooks/useActiveVessel';
import { useDashboardMetrics } from './useDashboardMetrics';
import { checklistApi } from '../../checklist/api/checklist.api';
import { issueApi } from '../../issues/api/issue.api';
import type { DashboardMetrics } from '../types/dashboard.types';
import React from 'react';

export interface DashboardTask {
  id: string;
  title: string;
  status: string | number;
  taskGroup: string;
  notes?: string | null;
  measurement?: string | null;
  hasIssue?: boolean;
}

export interface CycleStats {
  completed: number;
  total: number;
  postponed: number;
  pending: number;
}

export interface UseDashboardResult {
  metrics: DashboardMetrics | undefined;
  isLoading: boolean;
  error: Error | null;
  activeVesselName: string;
  activeVesselId: string;
  dailyTasks: DashboardTask[];
  weeklyTasks: DashboardTask[];
  monthlyTasks: DashboardTask[];
  signOnTasks: DashboardTask[];
  signOffTasks: DashboardTask[];
  dailyStats: CycleStats;
  weeklyStats: CycleStats;
  monthlyStats: CycleStats;
  signOnStats: CycleStats;
  signOffStats: CycleStats;
  postponedTasks: DashboardTask[];
  completedTasks: DashboardTask[];
  criticalIssues: any[];
  overdueCount: number;
  upcomingCount: number;
}

export const useDashboard = (): UseDashboardResult => {
  const { activeVessel, activeVesselId } = useActiveVessel();
  const vesselId = activeVesselId || '';

  const {
    data: metrics,
    isLoading: isMetricsLoading,
    error: metricsError,
  } = useDashboardMetrics(vesselId, !!vesselId);

  // Fetch checklist task records for today's date
  const todayStr = React.useMemo(() => new Date().toISOString().split('T')[0], []);
  const {
    data: tasksData,
    isLoading: isTasksLoading,
    error: tasksError,
  } = useQuery({
    queryKey: ['dashboard', 'tasks', vesselId, todayStr],
    queryFn: () => checklistApi.getChecklistRecords(vesselId, todayStr),
    enabled: !!vesselId,
  });

  // Fetch defect issues
  const {
    data: issuesData,
    isLoading: isIssuesLoading,
    error: issuesError,
  } = useQuery({
    queryKey: ['dashboard', 'issues', vesselId],
    queryFn: () => issueApi.getIssues(vesselId),
    enabled: !!vesselId,
  });

  const isLoading = !vesselId || isMetricsLoading || isTasksLoading || isIssuesLoading;
  
  const rawError = metricsError || tasksError || issuesError;
  const error = rawError ? (rawError instanceof Error ? rawError : new Error(String(rawError))) : null;

  // Flatten and normalize task records
  const allTasks = React.useMemo((): DashboardTask[] => {
    const raw = tasksData?.result || [];
    if (!Array.isArray(raw)) return [];

    if (raw.length > 0 && 'tasks' in raw[0]) {
      // Grouped structure: ChecklistCategoryGroup[]
      return raw.flatMap((group: any) =>
        (group.tasks || []).map((t: any) => ({
          id: t.id || t._id,
          title: t.title,
          status: t.status,
          taskGroup: t.taskGroup || 'Daily',
          notes: t.notes,
          measurement: t.measurement,
          hasIssue: !!t.hasIssue,
        }))
      );
    }

    // Flat structure: task records
    return raw.map((t: any) => ({
      id: t._id || t.id,
      title: t.taskSnapshot?.title || t.title || 'Unknown Task',
      status: t.status,
      taskGroup: t.taskSnapshot?.taskGroup || t.taskGroup || 'Daily',
      notes: t.notes,
      measurement: t.measurement,
      hasIssue: !!t.hasIssue,
    }));
  }, [tasksData]);

  // Extract active critical issues (Critical and Major severity levels)
  const criticalIssues = React.useMemo(() => {
    const issues = issuesData?.result || [];
    if (!Array.isArray(issues)) return [];
    return issues.filter((issue: any) =>
      (issue.severity === 'CRITICAL' || issue.severity === 'MAJOR') &&
      String(issue.status).toUpperCase() !== 'RESOLVED' &&
      String(issue.status).toUpperCase() !== 'CLOSED'
    );
  }, [issuesData]);

  // Filter tasks helper
  const getCycleTasks = (groupName: string) => {
    return allTasks.filter(t => {
      const g = String(t.taskGroup).toLowerCase();
      if (groupName === 'sign_on') {
        return g === 'sign_on' || g === 'signon';
      }
      if (groupName === 'sign_off') {
        return g === 'sign_off' || g === 'signoff';
      }
      return g === groupName.toLowerCase();
    });
  };

  const getCycleStats = (tasks: DashboardTask[]): CycleStats => {
    const completed = tasks.filter(t => {
      const s = String(t.status).toLowerCase();
      return s === 'completed' || s === '1';
    }).length;
    const postponed = tasks.filter(t => {
      const s = String(t.status).toLowerCase();
      return s === 'postponed' || s === '2';
    }).length;
    const total = tasks.length;
    const pending = total - completed - postponed;
    return { completed, total, postponed, pending };
  };

  const dailyTasks = React.useMemo(() => getCycleTasks('Daily'), [allTasks]);
  const weeklyTasks = React.useMemo(() => getCycleTasks('Weekly'), [allTasks]);
  const monthlyTasks = React.useMemo(() => getCycleTasks('Monthly'), [allTasks]);
  const signOnTasks = React.useMemo(() => getCycleTasks('sign_on'), [allTasks]);
  const signOffTasks = React.useMemo(() => getCycleTasks('sign_off'), [allTasks]);

  const dailyStats = React.useMemo(() => getCycleStats(dailyTasks), [dailyTasks]);
  const weeklyStats = React.useMemo(() => getCycleStats(weeklyTasks), [weeklyTasks]);
  const monthlyStats = React.useMemo(() => getCycleStats(monthlyTasks), [monthlyTasks]);
  const signOnStats = React.useMemo(() => getCycleStats(signOnTasks), [signOnTasks]);
  const signOffStats = React.useMemo(() => getCycleStats(signOffTasks), [signOffTasks]);

  const postponedTasks = React.useMemo(() => {
    return allTasks.filter(t => {
      const s = String(t.status).toLowerCase();
      return s === 'postponed' || s === '2';
    });
  }, [allTasks]);

  const completedTasks = React.useMemo(() => {
    return allTasks.filter(t => {
      const s = String(t.status).toLowerCase();
      return s === 'completed' || s === '1';
    });
  }, [allTasks]);

  // Overdue: uncompleted tasks with issues raised or postponed ones
  const overdueCount = React.useMemo(() => {
    const postponedCount = postponedTasks.length;
    const uncompletedWithIssues = allTasks.filter(t => {
      const s = String(t.status).toLowerCase();
      const isUncompleted = s !== 'completed' && s !== '1' && s !== 'postponed' && s !== '2';
      return isUncompleted && t.hasIssue;
    }).length;
    return postponedCount + uncompletedWithIssues;
  }, [postponedTasks, allTasks]);

  // Upcoming: remaining pending tasks
  const upcomingCount = React.useMemo(() => {
    return allTasks.filter(t => {
      const s = String(t.status).toLowerCase();
      return s !== 'completed' && s !== '1' && s !== 'postponed' && s !== '2';
    }).length;
  }, [allTasks]);

  return {
    metrics,
    isLoading,
    error,
    activeVesselName: activeVessel?.name || 'No Vessel Selected',
    activeVesselId: vesselId,
    dailyTasks,
    weeklyTasks,
    monthlyTasks,
    signOnTasks,
    signOffTasks,
    dailyStats,
    weeklyStats,
    monthlyStats,
    signOnStats,
    signOffStats,
    postponedTasks,
    completedTasks,
    criticalIssues,
    overdueCount,
    upcomingCount,
  };
};

export default useDashboard;
