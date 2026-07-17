import React from 'react';

interface ChecklistHeaderProps {
  vesselName: string;
  selectedDate: string;
  formattedDate: string;
  onDateChange: (date: string) => void;
}

export const ChecklistHeader: React.FC<ChecklistHeaderProps> = ({
  vesselName,
  selectedDate,
  formattedDate,
  onDateChange,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-900 pb-5 mb-6">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-100 font-sans">
          Vessel Checklists
        </h1>
        <p className="text-sm text-zinc-400 mt-1">
          Active Workspace: <span className="font-semibold text-sky-400">{vesselName}</span>
        </p>
      </div>

      <div className="flex items-center gap-3 bg-zinc-950 border border-zinc-900 px-4 py-2.5 rounded-xl shadow-inner relative">
        <span className="text-xs font-semibold text-zinc-550 uppercase tracking-wider hidden sm:inline">
          Log Date:
        </span>
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-sky-400 font-mono">{formattedDate}</span>
          <div className="relative cursor-pointer hover:text-sky-300 transition">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5 text-zinc-400 hover:text-sky-400 pointer-events-none">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
            </svg>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => onDateChange(e.target.value)}
              className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChecklistHeader;
