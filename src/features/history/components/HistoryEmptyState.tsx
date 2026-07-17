import React from 'react';
import { Card } from '@heroui/react';

export const HistoryEmptyState: React.FC = () => {
  return (
    <Card className="border border-zinc-900 bg-zinc-950/40 p-12 flex flex-col items-center justify-center text-center gap-5 min-h-[300px] backdrop-blur-md">
      <div className="w-14 h-14 rounded-full bg-zinc-900/60 border border-zinc-800 flex items-center justify-center text-zinc-550 shadow-inner">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.2} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
        </svg>
      </div>

      <div className="max-w-md">
        <h3 className="text-sm font-bold text-zinc-300 tracking-tight mb-2.5">No History Log Records Found</h3>
        <p className="text-xs text-zinc-450 leading-relaxed">
          There are no task execution logs matching your current search criteria or date range. Check your filters or select a different date range.
        </p>
      </div>
    </Card>
  );
};

export default HistoryEmptyState;
