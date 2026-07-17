import React from 'react';
import { ProgressCard } from './ProgressCard';
import { StatisticsCard } from './StatisticsCard';
import type { DashboardMetrics } from '../types/dashboard.types';
import { ROUTES } from '../../../constants/routes';

interface MetricsGridProps {
  metrics: DashboardMetrics;
}

export const MetricsGrid: React.FC<MetricsGridProps> = ({ metrics }) => {
  const {
    complianceRate = 0,
    completedCount = 0,
    pendingCount = 0,
    postponedCount = 0,
    activeIssues = 0,
  } = metrics;

  const totalToday = completedCount + pendingCount + postponedCount;
  const completionPercentage = totalToday > 0 ? (completedCount / totalToday) * 100 : 0;
  const completionSubtitle = `${completedCount} / ${totalToday} tasks`;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* 1. Compliance Score circular gauge */}
      <ProgressCard
        title="Compliance Score"
        description="Vessel safety & regulatory checklist compliance rating"
        type="circular"
        value={complianceRate}
      />

      {/* 2. Today's Task Completion progress */}
      <ProgressCard
        title="Today's Completion"
        description="Operational checklist task completion progress"
        type="linear"
        value={completionPercentage}
        subtitle={completionSubtitle}
      />

      {/* 3. Active Issues count card */}
      <StatisticsCard
        title="Active Issues"
        count={activeIssues}
        description="Vessel defects or task execution problems logged"
        badgeColor={activeIssues > 0 ? 'red' : 'zinc'}
        linkTo={ROUTES.ISSUES}
      />

      {/* 4. Postponed Tasks count card */}
      <StatisticsCard
        title="Postponed Tasks"
        count={postponedCount}
        description="Checklist tasks postponed with operational justification"
        badgeColor={postponedCount > 0 ? 'amber' : 'zinc'}
      />
    </div>
  );
};

export default MetricsGrid;
