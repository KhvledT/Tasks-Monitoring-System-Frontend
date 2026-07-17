import React from 'react';
import { Card } from '@heroui/react';

export const ChecklistEmptyState: React.FC = () => {
  return (
    <Card className="border border-zinc-900 bg-zinc-950/40 p-12 flex flex-col items-center justify-center text-center gap-5 min-h-[300px] backdrop-blur-md">
      <div className="w-14 h-14 rounded-full bg-zinc-900/60 border border-zinc-800 flex items-center justify-center text-zinc-550 shadow-inner">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.2} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.03 0 1.9.693 2.166 1.638m-7.377 0A48.536 48.536 0 0 1 12 3c1.2 0 2.392.049 3.57.145m-7.377 0a48.474 48.474 0 0 0-1.123.08A2.25 2.25 0 0 0 4.5 6.108V16.5A2.25 2.25 0 0 0 6.75 18.75h3.75" />
        </svg>
      </div>

      <div className="max-w-md">
        <h3 className="text-sm font-bold text-zinc-300 tracking-tight mb-2.5">No Checklist Tasks Found</h3>
        <p className="text-xs text-zinc-450 leading-relaxed">
          No operational tasks match the selected task group or query search criteria. Review your filters or try a different search.
        </p>
      </div>
    </Card>
  );
};

export default ChecklistEmptyState;
