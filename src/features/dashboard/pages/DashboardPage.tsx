import React from 'react';
import { useDashboard } from '../hooks/useDashboard';
import { useCurrentTime } from '../../../shared/hooks/useCurrentTime';
import { useAuth } from '../../../shared/hooks/useAuth';
import { DashboardHeader } from '../components/DashboardHeader';
import { MetricsGrid } from '../components/MetricsGrid';
import { RecentActivity } from '../components/RecentActivity';
import { DashboardEmptyState } from '../components/DashboardEmptyState';
import { DashboardSkeleton } from '../components/DashboardSkeleton';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { utcTimeStr, utcDateStr } = useCurrentTime();
  const { metrics, recentActivity, isLoading, error, isEmpty, activeVesselName } = useDashboard();

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <div className="flex flex-col gap-6 w-full">
        <div className="p-5 bg-red-950/20 border border-red-900/40 rounded-2xl flex flex-col gap-2.5 shadow-xl">
          <div className="flex items-center gap-2 text-red-400 font-bold text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
            </svg>
            System Synchronization Failure
          </div>
          <p className="text-xs text-zinc-400 font-medium leading-relaxed">
            We encountered an issue retrieving the aggregates for your current watch workspace from the shore server. 
            The system returned the following details:
          </p>
          <div className="bg-black/40 border border-zinc-900/60 p-3.5 rounded-xl font-mono text-xs text-red-350 select-all">
            {error.message || 'Unknown network or application error.'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 w-full animate-fade-in">
      {/* 1. Header with workspace information */}
      <DashboardHeader
        vesselName={activeVesselName}
        utcTime={utcTimeStr}
        utcDate={utcDateStr}
        userName={user?.fullName || 'Officer'}
      />

      {isEmpty ? (
        /* 2. Empty State View */
        <DashboardEmptyState />
      ) : (
        /* 3. Normal Analytics View */
        <>
          {metrics && <MetricsGrid metrics={metrics} />}
          
          <div className="grid grid-cols-1 gap-8 mt-2">
            <RecentActivity activities={recentActivity} />
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardPage;
