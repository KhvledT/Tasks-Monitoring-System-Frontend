import React from 'react';
import { Card } from '@heroui/react';

export const IssuesSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col gap-6 w-full animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-900 pb-5">
        <div className="flex flex-col gap-2">
          <div className="h-8 w-44 rounded bg-zinc-800 animate-shimmer" />
          <div className="h-4 w-60 rounded bg-zinc-855 animate-shimmer" />
        </div>
        <div className="h-10 w-36 rounded-xl bg-zinc-800 animate-shimmer" />
      </div>

      {/* Filters and Search Skeleton */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 justify-between">
        <div className="flex gap-2 bg-zinc-950 p-1 rounded-xl border border-zinc-900 w-full sm:w-auto h-10">
          {[1, 2].map((i) => (
            <div key={i} className="h-8 w-24 rounded-lg bg-zinc-850 animate-shimmer" />
          ))}
        </div>
        <div className="h-10 w-full sm:w-64 rounded-xl bg-zinc-800 animate-shimmer" />
      </div>

      {/* Grid Skeleton Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="border border-zinc-900 bg-zinc-950/40 p-5 rounded-2xl flex flex-col gap-4 overflow-hidden h-40 justify-between">
            <div className="flex flex-col gap-2">
              <div className="h-4 w-32 rounded bg-zinc-800 animate-shimmer" />
              <div className="h-3 w-48 rounded bg-zinc-850 animate-shimmer" />
            </div>
            <div className="h-3 w-20 rounded bg-zinc-850 animate-shimmer" />
          </Card>
        ))}
      </div>
    </div>
  );
};

export default IssuesSkeleton;
