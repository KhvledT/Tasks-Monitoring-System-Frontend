import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { historyApi } from '../../history/api/history.api';
import { adminApi } from '../../admin/api/admin.api';
import { useActiveVessel } from '../../../shared/hooks/useActiveVessel';
import { useAuth } from '../../../shared/hooks/useAuth';

interface ActivityItem {
  id: string;
  title: string;
  category: string;
  timestamp: string;
  badgeStyle: string;
  icon: string;
}

const formatRelativeTime = (dateStr?: string) => {
  if (!dateStr) return 'Just now';
  const now = new Date().getTime();
  const past = new Date(dateStr).getTime();
  const diffMs = Math.max(0, now - past);
  const mins = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
};

export const RecentActivityFeed: React.FC = () => {
  const { user } = useAuth();
  const { activeVesselId, viewedVesselId } = useActiveVessel();
  const targetVesselId = viewedVesselId || activeVesselId || '';
  const isSuperAdmin = user?.role === 'SUPER_ADMIN';

  // Fetch real history for regular users & captains
  const { data: historyData, isLoading: isHistoryLoading } = useQuery({
    queryKey: ['recent-activity-history', targetVesselId],
    queryFn: () => historyApi.getHistoryRecords(targetVesselId, 1, 5),
    enabled: !isSuperAdmin && !!targetVesselId,
  });

  // Fetch real user roster events for Super Admin
  const { data: usersData, isLoading: isUsersLoading } = useQuery({
    queryKey: ['recent-activity-users'],
    queryFn: () => adminApi.listUsers({ page: 1, limit: 5 }),
    enabled: isSuperAdmin,
  });

  const isLoading = isSuperAdmin ? isUsersLoading : isHistoryLoading;

  const activities: ActivityItem[] = React.useMemo(() => {
    if (isSuperAdmin) {
      const items = usersData?.items || [];
      return items.map((u) => ({
        id: u._id,
        title: `${u.fullName} (${u.role}) registered`,
        category: `Rank: ${u.rank || 'Officer'}`,
        timestamp: formatRelativeTime(u.createdAt),
        badgeStyle: u.isVerified
          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
          : 'bg-amber-50 text-amber-700 border-amber-200',
        icon: u.role === 'ADMIN' ? '👑' : '👨‍✈️',
      }));
    }

    const raw = historyData?.result?.items || historyData?.result || [];
    const items = Array.isArray(raw) ? raw.slice(0, 5) : [];

    return items.map((item: any) => {
      const isCompleted = String(item.status) === '1' || String(item.status).toLowerCase() === 'completed';
      const hasIssue = item.hasIssue || !!item.issue;

      let badgeStyle = 'bg-blue-50 text-blue-700 border-blue-200';
      let icon = '📜';

      if (hasIssue) {
        badgeStyle = 'bg-rose-50 text-rose-700 border-rose-200';
        icon = '⚠️';
      } else if (isCompleted) {
        badgeStyle = 'bg-emerald-50 text-emerald-700 border-emerald-200';
        icon = '✓';
      } else {
        badgeStyle = 'bg-amber-50 text-amber-700 border-amber-200';
        icon = '⏸';
      }

      return {
        id: item.id || item.taskRecordId || Math.random().toString(),
        title: item.title || 'Checklist Item Inspected',
        category: item.categoryName || item.taskGroup || (item.completedBy?.fullName ? `By: ${item.completedBy.fullName}` : 'Routine Inspection'),
        timestamp: formatRelativeTime(item.createdAt || item.issueDate),
        badgeStyle,
        icon,
      };
    });
  }, [isSuperAdmin, historyData, usersData]);

  return (
    <div className="bg-white border border-zinc-200 rounded-3xl p-6 shadow-sm flex flex-col gap-4 font-sans justify-between">
      <div className="flex items-center justify-between border-b border-zinc-150 pb-3">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded border border-purple-200">
            Realtime Activity Trail
          </span>
          <h3 className="text-base font-extrabold text-black tracking-tight mt-1">
            Recent Activity Feed
          </h3>
        </div>
        <span className="text-xs font-mono text-zinc-400 font-semibold">
          {isLoading ? 'Loading...' : 'Live Backend Data'}
        </span>
      </div>

      <div className="flex flex-col gap-2.5">
        {isLoading ? (
          <div className="p-4 text-center text-xs text-zinc-400 font-mono italic animate-pulse">
            Fetching recent operational activity...
          </div>
        ) : activities.length === 0 ? (
          <div className="p-4 text-center text-xs text-zinc-400 italic bg-zinc-50 border border-zinc-200 rounded-2xl">
            No recent activity recorded for this vessel workspace.
          </div>
        ) : (
          activities.map((item) => (
            <div
              key={item.id}
              className="p-3 bg-zinc-50/70 border border-zinc-150 rounded-2xl flex items-center justify-between gap-3 hover:bg-zinc-50 transition"
            >
              <div className="flex items-center gap-3">
                <span className="text-sm shrink-0">{item.icon}</span>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-black">{item.title}</span>
                  <span className="text-[10px] text-zinc-400 font-medium">{item.category}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded border ${item.badgeStyle}`}>
                  {item.timestamp}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecentActivityFeed;
