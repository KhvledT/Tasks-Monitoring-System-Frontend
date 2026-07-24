import React from 'react';
import { Link } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../../admin/api/admin.api';
import { crewApi } from '../../crew/api/crew.api';
import { issueApi } from '../../issues/api/issue.api';
import { useActiveVessel } from '../../../shared/hooks/useActiveVessel';
import { ROUTES } from '../../../constants/routes';

interface SystemAlertsWidgetProps {
  role?: string;
  activeVessel?: any;
}

export const SystemAlertsWidget: React.FC<SystemAlertsWidgetProps> = ({ role, activeVessel }) => {
  const { activeVesselId, viewedVesselId } = useActiveVessel();
  const targetVesselId = viewedVesselId || activeVesselId || '';
  const isSuperAdmin = role === 'SUPER_ADMIN';
  const isCaptain = role === 'ADMIN';
  const todayStr = React.useMemo(() => new Date().toISOString().split('T')[0], []);

  // 1. Super Admin Queries
  const { data: fleetSummary } = useQuery({
    queryKey: ['alerts-fleet-summary'],
    queryFn: () => adminApi.getFleetSummary(),
    enabled: isSuperAdmin,
  });

  const { data: captainsData } = useQuery({
    queryKey: ['alerts-captains'],
    queryFn: () => adminApi.listCaptains({ isVerified: false }),
    enabled: isSuperAdmin,
  });

  // 2. Captain Queries
  const { data: joinRequests = [] } = useQuery({
    queryKey: ['alerts-join-requests', targetVesselId],
    queryFn: () => crewApi.listJoinRequests(targetVesselId),
    enabled: isCaptain && !!targetVesselId,
  });

  // 3. Common Issues & Tasks Queries (Captain & Officer)
  const { data: issuesData } = useQuery({
    queryKey: ['alerts-issues', targetVesselId],
    queryFn: () => issueApi.getIssues(targetVesselId),
    enabled: !isSuperAdmin && !!targetVesselId,
  });

  const { data: tasksData } = useQuery({
    queryKey: ['alerts-tasks', targetVesselId, todayStr],
    queryFn: () => issueApi.getChecklistRecords(targetVesselId, todayStr),
    enabled: !isSuperAdmin && !!targetVesselId,
  });

  const alerts = React.useMemo(() => {
    if (isSuperAdmin) {
      const pendingCaptainsCount = captainsData?.pagination?.total ?? captainsData?.items?.length ?? 0;
      const totalDefectsCount = fleetSummary?.totalIssues ?? 0;
      const totalFleetVessels = fleetSummary?.totalVessels ?? 0;

      return [
        {
          id: 'alert-promotions',
          title: 'Pending Captain Promotions & Approvals',
          message: pendingCaptainsCount > 0
            ? `There are ${pendingCaptainsCount} captain account(s) pending credential verification.`
            : 'All captain accounts are currently verified and operational.',
          actionText: 'Review Users Directory',
          path: ROUTES.USERS_MANAGEMENT,
          badgeText: `${pendingCaptainsCount} Pending`,
          badgeStyle: pendingCaptainsCount > 0 ? 'bg-purple-100 text-purple-800 border-purple-200' : 'bg-[#0055d4]/10 text-[#0055d4] border-[#0055d4]/20',
        },
        {
          id: 'alert-vessels',
          title: 'Global Fleet Telemetry & Lifecycle',
          message: `Monitoring ${totalFleetVessels} vessel(s) and ${totalDefectsCount} global defect alarm logs across the platform.`,
          actionText: 'Inspect VIP Fleet',
          path: ROUTES.VIP_VESSELS,
          badgeText: `${totalFleetVessels} Vessels`,
          badgeStyle: 'bg-amber-100 text-amber-800 border-amber-200',
        },
        {
          id: 'alert-health',
          title: 'System Health & Infrastructure Telemetry',
          message: 'Real-time monitoring of database connection latency, server memory footprint, process uptime, and microservices status.',
          actionText: 'Inspect System Health',
          path: ROUTES.HEALTH_CHECK,
          badgeText: 'Live Telemetry',
          badgeStyle: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        },
      ];
    }

    const rawIssues = (issuesData as any)?.result || [];
    const openIssues = Array.isArray(rawIssues)
      ? rawIssues.filter((i: any) => String(i.status).toUpperCase() !== 'RESOLVED' && String(i.status).toUpperCase() !== 'CLOSED')
      : [];

    const rawTasks = (tasksData as any)?.result || [];
    const uncompletedTasks = Array.isArray(rawTasks)
      ? rawTasks.filter((t: any) => String(t.status) !== '1' && String(t.status).toLowerCase() !== 'completed')
      : [];

    if (isCaptain) {
      const pendingCount = joinRequests.length;
      const openDefectsCount = openIssues.length;

      return [
        {
          id: 'alert-join-requests',
          title: 'Officer Join Applications',
          message: pendingCount > 0
            ? `${pendingCount} incoming crew application(s) awaiting captain authorization for ${activeVessel?.name || 'vessel'}.`
            : 'No pending crew join applications requiring authorization.',
          actionText: 'Manage Join Requests',
          path: ROUTES.CREW,
          badgeText: `${pendingCount} Applications`,
          badgeStyle: pendingCount > 0 ? 'bg-sky-100 text-sky-800 border-sky-200' : 'bg-zinc-100 text-zinc-600 border-zinc-200',
        },
        {
          id: 'alert-defects',
          title: 'Unresolved Machinery Breakdown Alarms',
          message: openDefectsCount > 0
            ? `${openDefectsCount} open defect alarm(s) logged on ${activeVessel?.name || 'this vessel'}.`
            : 'No active machinery breakdown alarms logged.',
          actionText: 'Review Defects',
          path: openIssues.length > 0
            ? `${ROUTES.CREW}?openCrewDrawer=${openIssues[0].reporterId || openIssues[0].userId || openIssues[0].reportedBy || openIssues[0].crewId || ''}&tab=issues`
            : ROUTES.CREW,
          badgeText: `${openDefectsCount} Open Defect(s)`,
          badgeStyle: openDefectsCount > 0 ? 'bg-rose-100 text-rose-800 border-rose-200' : 'bg-emerald-100 text-emerald-800 border-emerald-200',
        },
        {
          id: 'alert-templates',
          title: 'Vessel Template Builder & Ranks',
          message: `Configure custom checklist items and rank assignments for ${activeVessel?.name || 'vessel'}.`,
          actionText: 'Open Template Builder',
          path: ROUTES.TEMPLATES,
          badgeText: 'Checklist Customizer',
          badgeStyle: 'bg-indigo-100 text-indigo-800 border-indigo-200',
        },
      ];
    }

    // Regular Officer / User Alerts
    const remainingChecksCount = uncompletedTasks.length;
    const activeAlarmsCount = openIssues.length;

    return [
      {
        id: 'alert-checklists',
        title: 'Daily Watchkeeper Inspection Checks',
        message: activeVessel
          ? `${remainingChecksCount} inspection check(s) remaining for today on ${activeVessel.name}.`
          : 'Select or join a vessel to access daily inspection checklists.',
        actionText: 'Execute Checklists',
        path: ROUTES.CHECKLISTS,
        badgeText: `${remainingChecksCount} Checks Due`,
        badgeStyle: remainingChecksCount > 0 ? 'bg-amber-100 text-amber-800 border-amber-200' : 'bg-emerald-100 text-emerald-800 border-emerald-200',
      },
      {
        id: 'alert-issues',
        title: 'Machinery Defect Alarms',
        message: activeAlarmsCount > 0
          ? `${activeAlarmsCount} active defect alarm(s) require monitoring.`
          : 'Log equipment breakdown alarms and track resolution notes.',
        actionText: 'Log Machinery Issue',
        path: ROUTES.ISSUES,
        badgeText: `${activeAlarmsCount} Active Alarms`,
        badgeStyle: activeAlarmsCount > 0 ? 'bg-rose-100 text-rose-800 border-rose-200' : 'bg-sky-100 text-sky-800 border-sky-200',
      },
      {
        id: 'alert-history',
        title: 'Logbook History Timeline',
        message: 'Review completed watch sessions, historical measurements, and digital sign-offs.',
        actionText: 'View Logbook History',
        path: ROUTES.HISTORY,
        badgeText: 'Logbook Audit',
        badgeStyle: 'bg-purple-100 text-purple-800 border-purple-200',
      },
    ];
  }, [isSuperAdmin, isCaptain, captainsData, fleetSummary, joinRequests, issuesData, tasksData, activeVessel]);

  return (
    <div className="bg-white border border-zinc-200 rounded-3xl p-6 shadow-sm flex flex-col gap-4 font-sans">
      <div className="flex items-center justify-between border-b border-zinc-150 pb-3">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded border border-amber-200">
            System Warnings & Actions
          </span>
          <h3 className="text-base font-extrabold text-black tracking-tight mt-1">
            Important Alerts & Priority Tasks
          </h3>
        </div>
        <span className="text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
          {alerts.length} Priority Items
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {alerts.map((item) => (
          <div
            key={item.id}
            className="p-4 bg-zinc-50/70 border border-zinc-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-zinc-50 transition"
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 border border-amber-200 flex items-center justify-center font-bold text-sm shrink-0 mt-0.5">
                🔔
              </div>
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold text-black">{item.title}</span>
                  <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded border ${item.badgeStyle}`}>
                    {item.badgeText}
                  </span>
                </div>
                <span className="text-[11px] text-zinc-500 font-medium leading-relaxed">
                  {item.message}
                </span>
              </div>
            </div>

            <Link
              to={item.path}
              className="px-3.5 py-1.5 bg-white border border-zinc-250 text-zinc-800 hover:text-[#0055d4] hover:border-[#0055d4] text-xs font-bold rounded-xl transition cursor-pointer shrink-0 shadow-2xs"
            >
              {item.actionText} &rarr;
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SystemAlertsWidget;
