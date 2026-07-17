import React from 'react';
import { Card } from '@heroui/react';
import { Link } from 'react-router';
import { ROUTES } from '../../../constants/routes';

export const DashboardEmptyState: React.FC = () => {
  return (
    <Card className="border border-zinc-900 bg-zinc-950/40 p-12 flex flex-col items-center justify-center text-center gap-5 min-h-[350px] backdrop-blur-md">
      <div className="w-16 h-16 rounded-full bg-zinc-900/60 border border-zinc-800 flex items-center justify-center text-zinc-550 shadow-inner">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.2} stroke="currentColor" className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-.778.099-1.533.284-2.253" />
        </svg>
      </div>

      <div className="max-w-md">
        <h3 className="text-lg font-bold text-zinc-200 tracking-tight mb-2">No Watch Activity Recorded</h3>
        <p className="text-sm text-zinc-400 font-medium leading-relaxed">
          There are no logged checklist operations or active issues on this vessel. Enjoy your quiet watch, or get started by reviewing active lists.
        </p>
      </div>

      <Link
        to={ROUTES.CHECKLISTS}
        className="px-5 py-2.5 bg-sky-950 text-sky-400 border border-sky-900/50 hover:bg-sky-900/40 hover:text-sky-300 font-semibold rounded-xl text-sm transition duration-150 active:scale-[0.98] shadow-lg shadow-sky-950/20"
      >
        View Checklists
      </Link>
    </Card>
  );
};

export default DashboardEmptyState;
