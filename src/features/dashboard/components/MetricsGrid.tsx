import React from 'react';
import { ProgressCard } from './ProgressCard';
import { StatisticsCard } from './StatisticsCard';
import type { DashboardMetrics } from '../types/dashboard.types';
import { ROUTES } from '../../../constants/routes';

interface MetricsGridProps {
  metrics: DashboardMetrics;
  overdueCount?: number;
  upcomingCount?: number;
  dailyStats?: { completed: number; total: number };
}

export const MetricsGrid: React.FC<MetricsGridProps> = ({
  metrics,
  overdueCount = 0,
  upcomingCount = 0,
  dailyStats = { completed: 0, total: 0 },
}) => {
  const { complianceRate = 0 } = metrics;

  const dailyPercentage = dailyStats.total > 0 ? (dailyStats.completed / dailyStats.total) * 100 : 0;
  const dailySubtitle = `${dailyStats.completed} / ${dailyStats.total} completed`;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* 1. Circular Gauge Compliance score */}
      <ProgressCard
        title="Compliance Score"
        description="Overall vessel safety & regulatory compliance rating"
        type="circular"
        value={complianceRate}
      />

      {/* 2. Daily Tasks Completion */}
      <ProgressCard
        title="Daily Tasks"
        description="Completed vs total daily operational checklists"
        type="linear"
        value={dailyPercentage}
        subtitle={dailySubtitle}
      />

      {/* 3. Overdue Tasks */}
      <StatisticsCard
        title="Overdue Tasks"
        count={overdueCount}
        description="Postponed tasks or tasks with active unresolved issues"
        badgeColor={overdueCount > 0 ? 'red' : 'zinc'}
      />

      {/* 4. Upcoming Tasks */}
      <StatisticsCard
        title="Upcoming Tasks"
        count={upcomingCount}
        description="Remaining pending checklist tasks to be verified"
        badgeColor={upcomingCount > 0 ? 'blue' : 'zinc'}
        linkTo={ROUTES.CHECKLISTS}
      />
    </div>
  );
};

export default MetricsGrid;
