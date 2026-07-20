import React from 'react';
import { Link } from 'react-router';
import { ROUTES } from '../../../constants/routes';

interface HistoryHeaderProps {}

export const HistoryHeader: React.FC<HistoryHeaderProps> = () => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-900 pb-5 mb-6">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-100 font-sans">
          Logbook History Timeline
        </h1>
        <p className="text-sm text-zinc-400 mt-1">
          Comprehensive chronological record of vessel operations and safety compliance events.
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Link
          to={ROUTES.REPORTS}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-[#003fa3] text-white text-xs font-semibold rounded-xl transition active:scale-[0.98] cursor-pointer shadow-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m.75 12 3 3m0 0 3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
          </svg>
          Navigate to Compliance Reports Center
        </Link>
      </div>
    </div>
  );
};

export default HistoryHeader;
