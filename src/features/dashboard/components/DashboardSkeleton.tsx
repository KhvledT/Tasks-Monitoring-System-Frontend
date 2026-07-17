import React from 'react';
import { Card } from '@heroui/react';

export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col gap-8 w-full animate-pulse">
      {/* Header Shimmer */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-900 pb-5">
        <div className="flex flex-col gap-2">
          <div className="h-8 w-48 rounded bg-zinc-800 animate-shimmer" />
          <div className="h-4 w-64 rounded bg-zinc-850 animate-shimmer" />
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <div className="h-4 w-32 rounded bg-zinc-850 animate-shimmer" />
          <div className="h-5 w-40 rounded bg-zinc-800 animate-shimmer" />
        </div>
      </div>

      {/* KPI Cards Grid Shimmer */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="border border-zinc-900 bg-zinc-950/40 p-6 h-40 flex flex-col justify-between overflow-hidden">
            <div className="flex flex-col gap-3">
              <div className="h-4 w-1/2 rounded bg-zinc-800 animate-shimmer" />
              <div className="h-3 w-1/3 rounded bg-zinc-850 animate-shimmer" />
            </div>
            <div className="h-8 w-2/3 rounded bg-zinc-800 animate-shimmer" />
          </Card>
        ))}
      </div>

      {/* Recent Activity Shimmer */}
      <Card className="border border-zinc-900 bg-zinc-950/40 p-6 flex flex-col gap-5">
        <div className="h-5 w-36 rounded bg-zinc-800 animate-shimmer mb-2" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center justify-between py-3 border-b border-zinc-900 last:border-0">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-zinc-800" />
              <div className="flex flex-col gap-2">
                <div className="h-4 w-40 rounded bg-zinc-800 animate-shimmer" />
                <div className="h-3 w-24 rounded bg-zinc-850 animate-shimmer" />
              </div>
            </div>
            <div className="h-4 w-28 rounded bg-zinc-800 animate-shimmer" />
          </div>
        ))}
      </Card>
    </div>
  );
};

export default DashboardSkeleton;
