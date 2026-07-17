import React from 'react';
import { Card } from '@heroui/react';

interface ProfileEmptyStateProps {
  message: string;
}

export const ProfileEmptyState: React.FC<ProfileEmptyStateProps> = ({ message }) => {
  return (
    <Card className="border border-zinc-900 bg-zinc-950/40 p-12 flex flex-col items-center justify-center text-center gap-5 min-h-[300px] backdrop-blur-md">
      <div className="w-14 h-14 rounded-full bg-zinc-900/60 border border-zinc-800 flex items-center justify-center text-zinc-500 shadow-inner">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.2} stroke="currentColor" className="w-6 h-6" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
        </svg>
      </div>

      <div className="max-w-md">
        <h3 className="text-sm font-bold text-zinc-300 tracking-tight mb-2.5">No Profile Available</h3>
        <p className="text-xs text-zinc-450 leading-relaxed">{message}</p>
      </div>
    </Card>
  );
};

export default ProfileEmptyState;
