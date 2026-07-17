import React from 'react';
import { Card } from '@heroui/react';

export const CardSkeleton: React.FC = () => {
  return (
    <Card className="w-full border border-zinc-850 bg-zinc-900/40 p-5 flex flex-col gap-3 overflow-hidden">
      <div className="h-4 w-2/5 rounded animate-shimmer" />
      <div className="h-3 w-4/5 rounded animate-shimmer" />
      <div className="h-3 w-3/5 rounded animate-shimmer" />
      <div className="flex gap-2 mt-2">
        <div className="h-8 w-20 rounded-lg animate-shimmer" />
        <div className="h-8 w-20 rounded-lg animate-shimmer" />
      </div>
    </Card>
  );
};
export default CardSkeleton;
