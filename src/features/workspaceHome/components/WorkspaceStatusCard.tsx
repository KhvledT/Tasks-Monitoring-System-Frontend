import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../../admin/api/admin.api';

interface WorkspaceStatusCardProps {
  user: any;
  activeVessel: any;
}

export const WorkspaceStatusCard: React.FC<WorkspaceStatusCardProps> = ({ user, activeVessel }) => {
  const isSuperAdmin = user?.role === 'SUPER_ADMIN';
  const isCaptain = user?.role === 'ADMIN';

  // Fetch Super Admin Fleet Summary
  const { data: fleetSummary } = useQuery({
    queryKey: ['fleet-summary-workspace-home'],
    queryFn: () => adminApi.getFleetSummary(),
    enabled: isSuperAdmin,
  });

  return (
    <div className="bg-[#001738] text-white border border-blue-900 rounded-3xl p-6 shadow-xl flex flex-col gap-5 font-sans relative overflow-hidden">
      {/* Background Glow Overlay */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-blue-800/60 pb-4 relative z-10">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-sky-400 bg-sky-950/80 px-2.5 py-0.5 rounded border border-sky-800">
            Live Workspace Status
          </span>
          <h3 className="text-lg font-extrabold text-white tracking-tight mt-1">
            Current Status & Telemetry Overview
          </h3>
        </div>
        <span className="text-xs font-mono font-medium text-sky-300 bg-blue-900/60 px-3 py-1 rounded-full border border-blue-700/50">
          Realtime Summary
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
        {isSuperAdmin ? (
          <>
            <div className="p-4 bg-blue-950/60 border border-blue-800/60 rounded-2xl flex flex-col justify-between">
              <span className="text-[10px] font-extrabold uppercase text-sky-300 tracking-wider">
                Total Fleet Vessels
              </span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-2xl font-black text-white">{fleetSummary?.totalVessels ?? 0}</span>
                <span className="text-xs text-sky-400 font-semibold">Registered Ships</span>
              </div>
            </div>

            <div className="p-4 bg-blue-950/60 border border-blue-800/60 rounded-2xl flex flex-col justify-between">
              <span className="text-[10px] font-extrabold uppercase text-sky-300 tracking-wider">
                Active Captains Roster
              </span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-2xl font-black text-sky-400">{fleetSummary?.totalCaptains ?? 0}</span>
                <span className="text-xs text-sky-300 font-semibold">Commanders</span>
              </div>
            </div>

            <div className="p-4 bg-blue-950/60 border border-blue-800/60 rounded-2xl flex flex-col justify-between">
              <span className="text-[10px] font-extrabold uppercase text-sky-300 tracking-wider">
                Registered User Officers
              </span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-2xl font-black text-emerald-400">{fleetSummary?.totalCrew ?? 0}</span>
                <span className="text-xs text-emerald-300 font-semibold">Total Accounts</span>
              </div>
            </div>

            <div className="p-4 bg-blue-950/60 border border-blue-800/60 rounded-2xl flex flex-col justify-between">
              <span className="text-[10px] font-extrabold uppercase text-sky-300 tracking-wider">
                Logged Defect Alarms
              </span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-2xl font-black text-amber-400">{fleetSummary?.totalIssues ?? 0}</span>
                <span className="text-xs text-amber-300 font-semibold">System Alarms</span>
              </div>
            </div>
          </>
        ) : isCaptain ? (
          <>
            <div className="p-4 bg-blue-950/60 border border-blue-800/60 rounded-2xl flex flex-col justify-between">
              <span className="text-[10px] font-extrabold uppercase text-sky-300 tracking-wider">
                Command Vessel
              </span>
              <span className="text-base font-extrabold text-white truncate mt-2">
                {activeVessel?.name || 'No Vessel Assigned'}
              </span>
            </div>

            <div className="p-4 bg-blue-950/60 border border-blue-800/60 rounded-2xl flex flex-col justify-between">
              <span className="text-[10px] font-extrabold uppercase text-sky-300 tracking-wider">
                Vessel Mode & Type
              </span>
              <span className="text-base font-extrabold text-sky-400 truncate mt-2">
                {activeVessel?.vesselMode || 'VIP'} &bull; {activeVessel?.type || 'Container'}
              </span>
            </div>

            <div className="p-4 bg-blue-950/60 border border-blue-800/60 rounded-2xl flex flex-col justify-between">
              <span className="text-[10px] font-extrabold uppercase text-sky-300 tracking-wider">
                Assigned Captain
              </span>
              <span className="text-base font-extrabold text-emerald-400 truncate mt-2">
                {user?.fullName || 'Captain'}
              </span>
            </div>

            <div className="p-4 bg-blue-950/60 border border-blue-800/60 rounded-2xl flex flex-col justify-between">
              <span className="text-[10px] font-extrabold uppercase text-sky-300 tracking-wider">
                Status Lifecycle
              </span>
              <span className="text-base font-extrabold text-indigo-300 truncate mt-2">
                {activeVessel?.vesselStatus || (activeVessel?.isActive ? 'Active' : 'Draft')}
              </span>
            </div>
          </>
        ) : (
          <>
            <div className="p-4 bg-blue-950/60 border border-blue-800/60 rounded-2xl flex flex-col justify-between">
              <span className="text-[10px] font-extrabold uppercase text-sky-300 tracking-wider">
                Assigned Vessel
              </span>
              <span className="text-base font-extrabold text-white truncate mt-2">
                {activeVessel?.name || 'No Active Vessel'}
              </span>
            </div>

            <div className="p-4 bg-blue-950/60 border border-blue-800/60 rounded-2xl flex flex-col justify-between">
              <span className="text-[10px] font-extrabold uppercase text-sky-300 tracking-wider">
                Shipboard Rank
              </span>
              <span className="text-base font-extrabold text-sky-400 truncate mt-2">
                {user?.rank || 'Cadet'}
              </span>
            </div>

            <div className="p-4 bg-blue-950/60 border border-blue-800/60 rounded-2xl flex flex-col justify-between">
              <span className="text-[10px] font-extrabold uppercase text-sky-300 tracking-wider">
                Task Workspace
              </span>
              <span className="text-base font-extrabold text-emerald-400 truncate mt-2">
                Routine Inspections
              </span>
            </div>

            <div className="p-4 bg-blue-950/60 border border-blue-800/60 rounded-2xl flex flex-col justify-between">
              <span className="text-[10px] font-extrabold uppercase text-sky-300 tracking-wider">
                Vessel Status
              </span>
              <span className="text-base font-extrabold text-amber-300 truncate mt-2">
                {activeVessel?.vesselStatus || (activeVessel ? 'Operational' : 'Unassigned')}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default WorkspaceStatusCard;
