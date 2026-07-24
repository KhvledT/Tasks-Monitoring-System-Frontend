import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../../admin/api/admin.api';
import { crewApi } from '../../crew/api/crew.api';
import { issueApi } from '../../issues/api/issue.api';
import { watchSessionApi } from '../../watchSession/api/watchSession.api';
import { useActiveVessel } from '../../../shared/hooks/useActiveVessel';

interface PlatformSummaryWidgetProps {
  user: any;
  activeVessel?: any;
}

export const PlatformSummaryWidget: React.FC<PlatformSummaryWidgetProps> = ({ user }) => {
  const { activeVesselId, viewedVesselId } = useActiveVessel();
  const targetVesselId = viewedVesselId || activeVesselId || '';
  const isSuperAdmin = user?.role === 'SUPER_ADMIN';
  const isCaptain = user?.role === 'ADMIN';
  const todayStr = React.useMemo(() => new Date().toISOString().split('T')[0], []);

  // 1. Super Admin Fleet Summary Query
  const { data: fleetSummary, isLoading: isFleetLoading } = useQuery({
    queryKey: ['fleet-summary-workspace-home'],
    queryFn: () => adminApi.getFleetSummary(),
    enabled: isSuperAdmin,
  });

  // 2. Captain & Officer Telemetry Queries
  const { data: crewMembers = [], isLoading: isCrewLoading } = useQuery({
    queryKey: ['widget-crew', targetVesselId],
    queryFn: () => crewApi.listCrew(targetVesselId),
    enabled: !isSuperAdmin && !!targetVesselId,
  });

  const { data: issuesData, isLoading: isIssuesLoading } = useQuery({
    queryKey: ['widget-issues', targetVesselId],
    queryFn: () => issueApi.getIssues(targetVesselId),
    enabled: !isSuperAdmin && !!targetVesselId,
  });

  const { data: tasksData, isLoading: isTasksLoading } = useQuery({
    queryKey: ['widget-tasks', targetVesselId, todayStr],
    queryFn: () => issueApi.getChecklistRecords(targetVesselId, todayStr),
    enabled: !isSuperAdmin && !!targetVesselId,
  });

  const { data: activeWatch, isLoading: isWatchLoading } = useQuery({
    queryKey: ['widget-watch', targetVesselId],
    queryFn: () => watchSessionApi.getActiveWatch(targetVesselId),
    enabled: !isSuperAdmin && !!targetVesselId,
  });

  const isLoading = isSuperAdmin
    ? isFleetLoading
    : isCrewLoading || isIssuesLoading || isTasksLoading || isWatchLoading;

  // Process live task stats
  const rawTasks = (tasksData as any)?.result || [];
  const taskList = Array.isArray(rawTasks) ? rawTasks : [];
  const completedTasksCount = taskList.filter((t: any) => String(t.status) === '1' || String(t.status).toLowerCase() === 'completed').length;
  const totalTasksCount = taskList.length;
  const complianceRate = totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : 100;

  // Process live defect stats
  const rawIssues = (issuesData as any)?.result || [];
  const issueList = Array.isArray(rawIssues) ? rawIssues : [];
  const openIssuesCount = issueList.filter((i: any) => String(i.status).toUpperCase() !== 'RESOLVED' && String(i.status).toUpperCase() !== 'CLOSED').length;

  return (
    <div className="bg-white border border-zinc-200 rounded-3xl p-6 shadow-sm flex flex-col gap-6 font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-zinc-150 pb-4">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#0055d4] bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
            Platform Summary & Telemetry
          </span>
          <h2 className="text-xl font-extrabold text-black tracking-tight mt-1">
            {isSuperAdmin ? 'Global SaaS Platform Metrics' : isCaptain ? 'Shipboard Operations Telemetry' : 'Operational Shift Telemetry'}
          </h2>
        </div>
        <span className="text-xs font-mono font-bold text-zinc-400 bg-zinc-100 px-3 py-1 rounded-full border border-zinc-200">
          {isLoading ? 'Updating Telemetry...' : 'Live Backend Data'}
        </span>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {isSuperAdmin ? (
          <>
            <div className="p-4 bg-purple-50/50 border border-purple-150 rounded-2xl flex flex-col justify-between">
              <span className="text-[10px] font-extrabold uppercase text-purple-700 tracking-wider">
                Total SaaS Users
              </span>
              <div className="flex items-baseline justify-between mt-2">
                <span className="text-2xl font-black text-purple-950">{fleetSummary?.totalCrew ?? 0}</span>
                <span className="text-[10px] font-bold text-purple-600 bg-purple-100 px-2 py-0.5 rounded-full">Active Roster</span>
              </div>
            </div>

            <div className="p-4 bg-sky-50/50 border border-sky-150 rounded-2xl flex flex-col justify-between">
              <span className="text-[10px] font-extrabold uppercase text-sky-700 tracking-wider">
                Active Captains
              </span>
              <div className="flex items-baseline justify-between mt-2">
                <span className="text-2xl font-black text-sky-950">{fleetSummary?.totalCaptains ?? 0}</span>
                <span className="text-[10px] font-bold text-sky-600 bg-sky-100 px-2 py-0.5 rounded-full">Commanders</span>
              </div>
            </div>

            <div className="p-4 bg-indigo-50/50 border border-indigo-150 rounded-2xl flex flex-col justify-between">
              <span className="text-[10px] font-extrabold uppercase text-indigo-700 tracking-wider">
                Total Fleet Vessels
              </span>
              <div className="flex items-baseline justify-between mt-2">
                <span className="text-2xl font-black text-indigo-950">{fleetSummary?.totalVessels ?? 0}</span>
                <span className="text-[10px] font-bold text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded-full">Global Fleet</span>
              </div>
            </div>

            <div className="p-4 bg-amber-50/50 border border-amber-150 rounded-2xl flex flex-col justify-between">
              <span className="text-[10px] font-extrabold uppercase text-amber-700 tracking-wider">
                System Defect Alarms
              </span>
              <div className="flex items-baseline justify-between mt-2">
                <span className="text-2xl font-black text-amber-950">{fleetSummary?.totalIssues ?? 0}</span>
                <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">Logbook Alarms</span>
              </div>
            </div>
          </>
        ) : isCaptain ? (
          <>
            <div className="p-4 bg-sky-50/50 border border-sky-150 rounded-2xl flex flex-col justify-between">
              <span className="text-[10px] font-extrabold uppercase text-sky-700 tracking-wider">
                Onboard Crew Roster
              </span>
              <div className="flex items-baseline justify-between mt-2">
                <span className="text-2xl font-black text-sky-950">{crewMembers.length}</span>
                <span className="text-[10px] font-bold text-sky-600 bg-sky-100 px-2 py-0.5 rounded-full">Officers</span>
              </div>
            </div>

            <div className="p-4 bg-emerald-50/50 border border-emerald-150 rounded-2xl flex flex-col justify-between">
              <span className="text-[10px] font-extrabold uppercase text-emerald-700 tracking-wider">
                Daily Check Compliance
              </span>
              <div className="flex items-baseline justify-between mt-2">
                <span className="text-2xl font-black text-emerald-950">{complianceRate}%</span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                  {completedTasksCount}/{totalTasksCount} Done
                </span>
              </div>
            </div>

            <div className="p-4 bg-rose-50/50 border border-rose-150 rounded-2xl flex flex-col justify-between">
              <span className="text-[10px] font-extrabold uppercase text-rose-700 tracking-wider">
                Open Machinery Defects
              </span>
              <div className="flex items-baseline justify-between mt-2">
                <span className="text-2xl font-black text-rose-950">{openIssuesCount}</span>
                <span className="text-[10px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full">
                  {openIssuesCount > 0 ? 'Action Required' : 'All Clear'}
                </span>
              </div>
            </div>

            <div className="p-4 bg-purple-50/50 border border-purple-150 rounded-2xl flex flex-col justify-between">
              <span className="text-[10px] font-extrabold uppercase text-purple-700 tracking-wider">
                Watchkeeping Shift
              </span>
              <div className="flex items-baseline justify-between mt-2">
                <span className="text-sm font-extrabold text-purple-950 truncate">
                  {activeWatch ? activeWatch.status : 'No Active Watch'}
                </span>
                <span className="text-[10px] font-bold text-purple-600 bg-purple-100 px-2 py-0.5 rounded-full shrink-0">
                  {activeWatch ? 'Active' : 'Offline'}
                </span>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="p-4 bg-emerald-50/50 border border-emerald-150 rounded-2xl flex flex-col justify-between">
              <span className="text-[10px] font-extrabold uppercase text-emerald-700 tracking-wider">
                Checks Completed Today
              </span>
              <div className="flex items-baseline justify-between mt-2">
                <span className="text-2xl font-black text-emerald-950">{completedTasksCount}</span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                  Of {totalTasksCount} Total
                </span>
              </div>
            </div>

            <div className="p-4 bg-sky-50/50 border border-sky-150 rounded-2xl flex flex-col justify-between">
              <span className="text-[10px] font-extrabold uppercase text-sky-700 tracking-wider">
                Compliance Score
              </span>
              <div className="flex items-baseline justify-between mt-2">
                <span className="text-2xl font-black text-sky-950">{complianceRate}%</span>
                <span className="text-[10px] font-bold text-sky-600 bg-sky-100 px-2 py-0.5 rounded-full">Daily Target</span>
              </div>
            </div>

            <div className="p-4 bg-rose-50/50 border border-rose-150 rounded-2xl flex flex-col justify-between">
              <span className="text-[10px] font-extrabold uppercase text-rose-700 tracking-wider">
                Machinery Defect Alarms
              </span>
              <div className="flex items-baseline justify-between mt-2">
                <span className="text-2xl font-black text-rose-950">{openIssuesCount}</span>
                <span className="text-[10px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full">Alarms Logged</span>
              </div>
            </div>

            <div className="p-4 bg-indigo-50/50 border border-indigo-150 rounded-2xl flex flex-col justify-between">
              <span className="text-[10px] font-extrabold uppercase text-indigo-700 tracking-wider">
                Watchkeeping Status
              </span>
              <div className="flex items-baseline justify-between mt-2">
                <span className="text-sm font-extrabold text-indigo-950 truncate">
                  {activeWatch ? activeWatch.status : 'Watch Offline'}
                </span>
                <span className="text-[10px] font-bold text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded-full shrink-0">
                  {activeWatch ? 'Live Shift' : 'Idle'}
                </span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PlatformSummaryWidget;
