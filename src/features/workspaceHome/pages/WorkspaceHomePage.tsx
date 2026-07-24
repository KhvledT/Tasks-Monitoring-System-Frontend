import React from "react";
import { useAuth } from "../../../shared/hooks/useAuth";
import { useActiveVessel } from "../../../shared/hooks/useActiveVessel";
import { AccountSummaryCard } from "../components/AccountSummaryCard";
import { RolePermissionsCard } from "../components/RolePermissionsCard";
import { PlatformSummaryWidget } from "../components/PlatformSummaryWidget";
import { SystemAlertsWidget } from "../components/SystemAlertsWidget";
import { RecentActivityFeed } from "../components/RecentActivityFeed";
import { QuickActionGrid } from "../components/QuickActionGrid";

export const WorkspaceHomePage: React.FC = () => {
  const { user } = useAuth();
  const { activeVessel } = useActiveVessel();

  const formattedDate = React.useMemo(() => {
    return new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }, []);

  return (
    <div className="flex flex-col gap-8 font-sans pb-16">
      {/* Header Command Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-blue-950 to-indigo-950 text-white p-6 md:p-8 rounded-3xl shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col gap-1 relative z-10">
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold uppercase tracking-widest text-sky-400 bg-sky-950/80 px-3 py-0.5 rounded-full border border-sky-800">
              Primary Command Center & Management Hub
            </span>
            <span className="text-xs font-mono font-medium">
              &bull; {formattedDate}
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight mt-1">
            Workspace Home
          </h1>
          <p className="text-xs md:text-sm text-sky-100/80 max-w-2xl leading-relaxed mt-0.5">
            Monitor SaaS telemetry, inspect role capabilities, review platform
            alerts, and launch operational management modules.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10 shrink-0">
          <div className="px-4 py-2 bg-blue-900/60 border border-blue-700/60 rounded-2xl flex flex-col items-end text-right">
            <span className="text-[10px] font-extrabold uppercase text-sky-300 tracking-wider">
              Telemetry State
            </span>
            <span className="text-xs font-black text-emerald-400 flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Live Backend Control
            </span>
          </div>
        </div>
      </div>

      {/* Section 1: Account Identity & Role Capabilities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AccountSummaryCard user={user} activeVessel={activeVessel} />
        <RolePermissionsCard role={user?.role} />
      </div>

      {/* Section 2: Platform Summary & Telemetry (Replaces Standalone Information-Only Pages) */}
      <PlatformSummaryWidget user={user} activeVessel={activeVessel} />

      {/* Section 3: Important Alerts & Realtime Activity Trail */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SystemAlertsWidget role={user?.role} activeVessel={activeVessel} />
        </div>
        <div className="lg:col-span-1">
          <RecentActivityFeed />
        </div>
      </div>

      {/* Section 4: Dynamic Navigation Hub (Category B Management Pages) */}
      <QuickActionGrid role={user?.role} />
    </div>
  );
};

export default WorkspaceHomePage;
