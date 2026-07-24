import React from "react";
import { Link } from "react-router";
import { WatchSessionCockpit } from "../../watchSession/components/WatchSessionCockpit";
import { DashboardHeader } from "./DashboardHeader";
import { MetricsGrid } from "./MetricsGrid";
import { ROUTES } from "../../../constants/routes";

interface UserDashboardViewProps {
  activeVesselId: string | null;
  activeVesselName: string;
  utcTimeStr: string;
  utcDateStr: string;
  userName: string;
  metrics: any;
  overdueCount: number;
  upcomingCount: number;
  dailyStats: any;
  dailyTasks: any[];
}

export const UserDashboardView: React.FC<UserDashboardViewProps> = ({
  activeVesselId,
  activeVesselName,
  utcTimeStr,
  utcDateStr,
  userName,
  metrics,
  overdueCount,
  upcomingCount,
  dailyStats,
  dailyTasks,
}) => {
  return (
    <div className="flex flex-col gap-6 w-full animate-fade-in pb-10 font-sans">
      {/* Operational Header */}
      <DashboardHeader
        vesselName={activeVesselName}
        utcTime={utcTimeStr}
        utcDate={utcDateStr}
        userName={userName}
      />

      {/* Watchkeeping Session Cockpit */}
      {activeVesselId && <WatchSessionCockpit vesselId={activeVesselId} />}

      {/* Operational Metrics */}
      {metrics && (
        <MetricsGrid
          metrics={metrics}
          overdueCount={overdueCount}
          upcomingCount={upcomingCount}
          dailyStats={dailyStats}
        />
      )}

      {/* Daily Watch Tasks Checklist Shortcuts */}
      <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-xs flex flex-col gap-4">
        <div className="flex justify-between items-center border-b border-zinc-150 pb-3">
          <div>
            <h3 className="text-sm font-bold text-black uppercase tracking-wider">Daily Watch Checklists</h3>
            <p className="text-xs text-zinc-400 mt-0.5">Assigned operational inspection checks for current shift.</p>
          </div>
          <Link
            to={ROUTES.CHECKLISTS}
            className="px-4 py-2 bg-primary hover:bg-[#003fa3] text-white text-xs font-bold rounded-xl transition shadow-xs"
          >
            Execute Checklists &rarr;
          </Link>
        </div>

        {dailyTasks.length === 0 ? (
          <p className="text-xs text-zinc-400 italic">No pending daily inspection tasks.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {dailyTasks.slice(0, 5).map((task: any) => (
              <div key={task.id || task._id} className="p-3 bg-zinc-50 border border-zinc-200 rounded-xl flex justify-between items-center text-xs">
                <span className="font-bold text-black">{task.title}</span>
                <span className="text-[10px] font-extrabold uppercase bg-amber-50 text-amber-700 px-2 py-0.5 rounded border border-amber-200">
                  {String(task.status) === "1" || String(task.status).toLowerCase() === "completed" ? "Completed" : String(task.status) === "2" || String(task.status).toLowerCase() === "postponed" ? "Postponed" : "Pending"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Log Machinery Defect Floating Shortcut */}
      <div className="flex justify-end">
        <Link
          to={ROUTES.ISSUES}
          className="px-5 py-3 bg-red-600 hover:bg-red-700 text-white text-xs font-extrabold rounded-2xl transition shadow-lg flex items-center gap-2"
        >
          <span>⚠️ Log Machinery Defect</span>
        </Link>
      </div>
    </div>
  );
};

export default UserDashboardView;
