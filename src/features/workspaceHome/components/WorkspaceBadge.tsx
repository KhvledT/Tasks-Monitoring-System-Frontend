import React from 'react';

interface WorkspaceBadgeProps {
  role?: string;
}

export const WorkspaceBadge: React.FC<WorkspaceBadgeProps> = ({ role }) => {
  if (role === 'SUPER_ADMIN') {
    return (
      <div className="flex flex-col gap-0.5">
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded border border-purple-200 self-start">
          Platform Management Workspace
        </span>
        <span className="text-[11px] text-zinc-500 font-medium">
          Global Fleet Governance & Platform Administration
        </span>
      </div>
    );
  }

  if (role === 'ADMIN') {
    return (
      <div className="flex flex-col gap-0.5">
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded border border-sky-200 self-start">
          Vessel Management Workspace
        </span>
        <span className="text-[11px] text-zinc-500 font-medium">
          Ship Operations, Crew Governance & Command Cockpit
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200 self-start">
        Operational Workspace
      </span>
      <span className="text-[11px] text-zinc-500 font-medium">
        Shipboard Task & Watchkeeping Execution
      </span>
    </div>
  );
};

export default WorkspaceBadge;
