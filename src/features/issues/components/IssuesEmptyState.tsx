import React from 'react';
import { Card } from '@heroui/react';

export const IssuesEmptyState: React.FC = () => {
  return (
    <Card className="border border-zinc-900 bg-zinc-950/40 p-12 flex flex-col items-center justify-center text-center gap-5 min-h-[300px] backdrop-blur-md">
      <div className="w-14 h-14 rounded-full bg-zinc-900/60 border border-zinc-800 flex items-center justify-center text-zinc-550 shadow-inner animate-pulse">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.2} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
        </svg>
      </div>

      <div className="max-w-md">
        <h3 className="text-sm font-bold text-zinc-300 tracking-tight mb-2.5">No Issues Logged</h3>
        <p className="text-xs text-zinc-450 leading-relaxed">
          There are no reported defects or equipment issues logged for this vessel. Reported issue logs will populate here.
        </p>
      </div>
    </Card>
  );
};

export default IssuesEmptyState;
