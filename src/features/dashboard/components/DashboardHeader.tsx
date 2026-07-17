import React from 'react';

interface DashboardHeaderProps {
  vesselName: string;
  utcTime: string;
  utcDate: string;
  userName: string;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  vesselName,
  utcTime,
  utcDate,
  userName,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-900 pb-5 mb-8">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-100 font-sans">
          Welcome back, {userName || 'Officer'}
        </h1>
        <p className="text-sm text-zinc-400 mt-1">
          Active Workspace: <span className="font-semibold text-sky-400">{vesselName}</span>
        </p>
      </div>

      <div className="flex flex-col md:items-end gap-0.5 bg-zinc-950 border border-zinc-900 px-4 py-2.5 rounded-xl shadow-inner">
        <span className="text-xs font-semibold text-zinc-550 uppercase tracking-widest block">
          Current Watch Stand
        </span>
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-zinc-300">{utcDate}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse" />
          <span className="text-sm font-bold text-sky-400 font-mono">{utcTime}</span>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
