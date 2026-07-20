import React, { useState } from 'react';
import { useDashboard, type DashboardTask } from '../hooks/useDashboard';
import { useCurrentTime } from '../../../shared/hooks/useCurrentTime';
import { useAuth } from '../../../shared/hooks/useAuth';
import { useActiveVessel } from '../../../shared/hooks/useActiveVessel';
import { DashboardHeader } from '../components/DashboardHeader';
import { MetricsGrid } from '../components/MetricsGrid';
import { DashboardSkeleton } from '../components/DashboardSkeleton';
import { WatchSessionCockpit } from '../../watchSession/components/WatchSessionCockpit';
import { Link } from 'react-router';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { utcTimeStr, utcDateStr } = useCurrentTime();
  const {
    metrics,
    isLoading,
    error,
    activeVesselName,
    activeVesselId,
    dailyTasks,
    weeklyTasks,
    monthlyTasks,
    signOnTasks,
    signOffTasks,
    dailyStats,
    weeklyStats,
    monthlyStats,
    signOnStats,
    signOffStats,
    postponedTasks,
    completedTasks,
    criticalIssues,
    overdueCount,
    upcomingCount,
  } = useDashboard();

  const { isArchiveMode } = useActiveVessel();

  const [isArchiveOpen, setIsArchiveOpen] = useState(false);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <div className="flex flex-col gap-6 w-full">
        <div className="p-5 bg-red-955/20 border border-red-900/40 rounded-2xl flex flex-col gap-2.5 shadow-xl">
          <div className="flex items-center gap-2 text-red-400 font-bold text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
            </svg>
            System Synchronization Failure
          </div>
          <p className="text-xs text-zinc-400 font-medium leading-relaxed">
            We encountered an issue retrieving the aggregates for your current watch workspace.
          </p>
          <div className="bg-black/40 border border-zinc-900/60 p-3.5 rounded-xl font-mono text-xs text-red-350 select-all">
            {error.message || 'Unknown network or application error.'}
          </div>
        </div>
      </div>
    );
  }

  const renderTaskSection = (
    title: string,
    tasks: DashboardTask[],
    stats: { completed: number; total: number },
    colorClass: string
  ) => {
    return (
      <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm flex flex-col gap-3">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
          <div className="flex flex-col gap-0.5">
            <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${colorClass}`} />
              {title}
            </h4>
            <span className="text-[10px] text-zinc-400 font-semibold pl-4">
              {stats.completed} / {stats.total} Completed
            </span>
          </div>
          {tasks.some(t => {
            const s = String(t.status).toLowerCase();
            return s !== 'completed' && s !== '1' && s !== 'postponed' && s !== '2';
          }) && !isArchiveMode && (
            <Link to="/checklists" className="text-[10px] text-primary font-bold hover:underline">
              Resolve Checks &rarr;
            </Link>
          )}
        </div>
        {tasks.length === 0 ? (
          <p className="text-xs text-zinc-400 italic py-1">No active tasks for current week.</p>
        ) : (
          <div className="flex flex-col gap-2 max-h-[220px] overflow-y-auto pr-1">
            {tasks.map((task) => {
              const statusStr = String(task.status).toLowerCase();
              const isCompleted = statusStr === 'completed' || statusStr === '1';
              const isPostponed = statusStr === 'postponed' || statusStr === '2';

              return (
                <div key={task.id} className="flex items-center gap-3 group">
                  <input
                    type="checkbox"
                    checked={isCompleted}
                    readOnly
                    className="w-4 h-4 rounded border-zinc-300 text-primary focus:ring-primary/20 shrink-0"
                  />
                  <span className={`text-xs font-medium ${isCompleted ? 'text-zinc-400 line-through' : isPostponed ? 'text-amber-600' : 'text-gray'} group-hover:text-black transition flex-1`}>
                    {task.title}
                  </span>
                </div>
              );
            })}
          </div>
        )}
        {tasks.some(t => {
          const s = String(t.status).toLowerCase();
          return s !== 'completed' && s !== '1' && s !== 'postponed' && s !== '2';
        }) && !isArchiveMode && (
          <Link to="/checklists" className="text-xs font-bold text-primary hover:underline mt-1 inline-block">
            Resolve Checks
          </Link>
        )}
        {title.startsWith('Sign-On') || title.startsWith('Sign-Off') ? (
          tasks.length > 0 && !isArchiveMode && (
            <a href="/checklists" className="text-xs font-bold text-primary hover:underline mt-1 inline-block">
              Finalize
            </a>
          )
        ) : null}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-6 w-full animate-fade-in pb-10">
      {/* 1. Header with workspace information */}
      <DashboardHeader
        vesselName={activeVesselName}
        utcTime={utcTimeStr}
        utcDate={utcDateStr}
        userName={user?.fullName || 'Officer'}
      />

      {/* 2. Watchkeeping Session Cockpit */}
      {activeVesselId && !isArchiveMode && <WatchSessionCockpit vesselId={activeVesselId} />}

      {/* 3. Metrics Summary widgets */}
      {metrics && (
        <MetricsGrid
          metrics={metrics}
          overdueCount={overdueCount}
          upcomingCount={upcomingCount}
          dailyStats={dailyStats}
        />
      )}

      {/* 4. Critical System Alarms */}
      {criticalIssues.length > 0 && (
        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-bold text-black flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4.5 h-4.5 text-amber-500">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
            Critical System Alarms
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {criticalIssues.map((issue: any) => {
              const isCritical = (issue.severity || '').toUpperCase() === 'CRITICAL';
              return (
                <div key={issue.id || issue._id} className={`p-4 ${isCritical ? 'bg-red-50 border-red-200' : 'bg-orange-50 border-orange-200'} border rounded-2xl flex flex-col gap-2 shadow-sm`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${isCritical ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                        </svg>
                      </div>
                      <span className={`text-sm font-bold ${isCritical ? 'text-red-700' : 'text-orange-700'}`}>
                        {issue.description}
                      </span>
                    </div>
                    <span className="text-[10px] text-zinc-400 font-mono shrink-0">
                      {new Date(issue.issueDate).toLocaleDateString()}
                    </span>
                  </div>
                  {issue.note && (
                    <p className="text-[11px] text-zinc-500 leading-relaxed mt-0.5">
                      {issue.note}
                    </p>
                  )}
                  <div className="flex items-center gap-2 mt-1">
                    <Link to="/issues" className={`px-3 py-1.5 text-[10px] font-bold rounded-lg ${isCritical ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-orange-600 text-white hover:bg-orange-700'} transition cursor-pointer`}>
                      Acknowledge
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 5. Active Watch Tasks */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-black">
            Active Watch Tasks
          </h3>
          <Link to="/checklists" className="text-xs font-bold text-primary hover:underline">
            View All Tasks
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {renderTaskSection('Daily Checks', dailyTasks, dailyStats, 'bg-emerald-500')}
          {renderTaskSection('Weekly Checks', weeklyTasks, weeklyStats, 'bg-sky-500')}
          {renderTaskSection('Monthly', monthlyTasks, monthlyStats, 'bg-purple-500')}
          {renderTaskSection('Sign-On', signOnTasks, signOnStats, 'bg-indigo-500')}
          {renderTaskSection('Sign-Off', signOffTasks, signOffStats, 'bg-amber-500')}
        </div>
      </div>

      {/* 6. Completed Shift Audits Archive */}
      <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm flex flex-col gap-3 mt-2">
        <button
          onClick={() => setIsArchiveOpen(!isArchiveOpen)}
          className="flex items-center justify-between w-full text-left cursor-pointer"
        >
          <span className="text-sm font-bold text-black flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4.5 h-4.5 text-zinc-500">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
            </svg>
            Completed Shift Audits Archive
            <span className="text-[10px] font-bold bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded-full border border-zinc-200">{completedTasks.length} TOTAL</span>
          </span>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`w-4 h-4 text-zinc-400 transition-transform duration-200 ${isArchiveOpen ? 'rotate-180' : ''}`}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
          </svg>
        </button>

        {isArchiveOpen && (
          <div className="flex flex-col gap-2 mt-2 border-t border-zinc-100 pt-3 max-h-[300px] overflow-y-auto">
            {completedTasks.length === 0 ? (
              <p className="text-xs text-zinc-400 italic py-2">No tasks completed during this watch shift yet.</p>
            ) : (
              completedTasks.map((task) => (
                <div key={task.id} className="p-3 bg-zinc-50 border border-zinc-100 rounded-xl flex items-center justify-between gap-3">
                  <span className="text-xs font-semibold text-zinc-400 line-through">
                    {task.title}
                  </span>
                  <span className="text-[9px] bg-emerald-50 border border-emerald-200 text-emerald-600 font-bold px-2 py-0.5 rounded uppercase">
                    COMPLETED
                  </span>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
