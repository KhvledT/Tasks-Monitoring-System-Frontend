import React from 'react';
import { Card } from '@heroui/react';
import type { RecentActivityItem } from '../types/dashboard.types';

interface RecentActivityProps {
  activities: RecentActivityItem[];
}

export const RecentActivity: React.FC<RecentActivityProps> = ({ activities }) => {
  const formatTime = (dateStr?: string) => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      // Format as DD MMM YYYY HH:MM
      const day = String(date.getUTCDate()).padStart(2, '0');
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const month = months[date.getUTCMonth()];
      const year = date.getUTCFullYear();
      const hours = String(date.getUTCHours()).padStart(2, '0');
      const minutes = String(date.getUTCMinutes()).padStart(2, '0');
      return `${day} ${month} ${year} ${hours}:${minutes} UTC`;
    } catch {
      return dateStr;
    }
  };

  const getGroupBadgeColor = (group: string) => {
    switch (group?.toLowerCase()) {
      case 'daily':
        return 'bg-blue-950/30 text-blue-400 border-blue-900/40';
      case 'weekly':
        return 'bg-purple-950/30 text-purple-400 border-purple-900/40';
      case 'monthly':
        return 'bg-pink-950/30 text-pink-400 border-pink-900/40';
      case 'signingon':
      case 'signing-on':
        return 'bg-emerald-950/30 text-emerald-400 border-emerald-900/40';
      default:
        return 'bg-zinc-900/50 text-zinc-400 border-zinc-800';
    }
  };

  const getStatusDetails = (status: string | number) => {
    const s = String(status).toLowerCase();
    if (s === 'postponed' || s === '2') {
      return {
        label: 'Postponed',
        textClass: 'text-amber-400',
        dotBg: 'bg-amber-500',
      };
    }
    return {
      label: 'Completed',
      textClass: 'text-emerald-400',
      dotBg: 'bg-emerald-500',
    };
  };

  return (
    <Card className="border border-zinc-900 bg-zinc-950/40 p-6 backdrop-blur-md hover:border-zinc-850 transition duration-350">
      <div className="flex items-center justify-between border-b border-zinc-900/60 pb-4 mb-5">
        <h4 className="font-bold text-base text-zinc-200 tracking-tight flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5 text-sky-400">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z" />
          </svg>
          Recent Logbook Entries
        </h4>
        <span className="text-xs text-zinc-550 font-medium">Last 5 logs</span>
      </div>

      <div className="flex flex-col gap-4">
        {activities.map((activity) => {
          const statusDetails = getStatusDetails(activity.status);
          return (
            <div
              key={activity.id}
              className="flex flex-col gap-2 py-3.5 px-4 rounded-xl bg-zinc-950/60 border border-zinc-900/50 hover:border-zinc-850 hover:bg-zinc-950 transition duration-200"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-2.5 min-w-0">
                  <span className={`w-2 h-2 rounded-full ${statusDetails.dotBg} animate-pulse shrink-0 mt-1.5`} />
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-zinc-200 tracking-tight leading-snug truncate">
                      {activity.taskTitle}
                    </p>
                    <p className="text-[10px] font-bold text-zinc-550 uppercase tracking-wider mt-0.5">
                      {activity.categoryName || 'General operational check'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded border ${getGroupBadgeColor(activity.taskGroup)}`}>
                    {activity.taskGroup}
                  </span>
                </div>
              </div>

              {activity.notes && (
                <div className="text-xs text-zinc-400 bg-zinc-900/20 border-l-2 border-zinc-700 pl-2.5 py-1 my-1 italic">
                  {activity.notes}
                </div>
              )}

              <div className="flex items-center justify-between text-[10px] text-zinc-500 font-medium border-t border-zinc-900/60 pt-2 mt-1">
                <span>Status: <span className={`font-semibold uppercase ${statusDetails.textClass}`}>{statusDetails.label}</span></span>
                <span className="font-mono">{formatTime(activity.completionDate)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default RecentActivity;
