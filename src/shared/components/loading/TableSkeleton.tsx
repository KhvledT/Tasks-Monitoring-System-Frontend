import React from 'react';
import { Card } from '@heroui/react';

export const TableSkeleton: React.FC = () => {
  return (
    <Card className="w-full border border-zinc-850 bg-zinc-900/40 p-6 flex flex-col gap-4">
      {/* Table Header Shimmer */}
      <div className="flex gap-4 border-b border-zinc-850 pb-3">
        <div className="h-4 w-1/6 rounded animate-shimmer" />
        <div className="h-4 w-2/6 rounded animate-shimmer" />
        <div className="h-4 w-1/6 rounded animate-shimmer" />
        <div className="h-4 w-1/6 rounded animate-shimmer" />
        <div className="h-4 w-1/6 rounded animate-shimmer" />
      </div>
      
      {/* Table Rows Shimmers */}
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="flex gap-4 items-center">
          <div className="h-3 w-1/6 rounded animate-shimmer" />
          <div className="h-3 w-2/6 rounded animate-shimmer" />
          <div className="h-3 w-1/6 rounded animate-shimmer" />
          <div className="h-3 w-1/6 rounded animate-shimmer" />
          <div className="h-3 w-1/6 rounded animate-shimmer" />
        </div>
      ))}
    </Card>
  );
};
export default TableSkeleton;
