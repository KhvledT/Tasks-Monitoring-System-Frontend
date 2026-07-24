import React from "react";
import { useDashboard } from "../hooks/useDashboard";
import { useCurrentTime } from "../../../shared/hooks/useCurrentTime";
import { useAuth } from "../../../shared/hooks/useAuth";
import { DashboardSkeleton } from "../components/DashboardSkeleton";
import { UserDashboardView } from "../components/UserDashboardView";
import { CaptainDashboardView } from "../components/CaptainDashboardView";
import { SuperAdminDashboardView } from "../components/SuperAdminDashboardView";

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { utcTimeStr, utcDateStr } = useCurrentTime();
  const {
    metrics,
    isLoading,
    activeVesselName,
    activeVesselId,
    dailyTasks,
    dailyStats,
    criticalIssues,
    overdueCount,
    upcomingCount,
  } = useDashboard();

  // 1. SUPER_ADMIN Isolated Dashboard View
  if (user?.role === "SUPER_ADMIN") {
    return <SuperAdminDashboardView userName={user?.fullName || "Custodian"} />;
  }

  // 2. CAPTAIN (ADMIN) Isolated Dashboard View
  if (user?.role === "ADMIN") {
    return (
      <CaptainDashboardView
        activeVesselName={activeVesselName}
        utcTimeStr={utcTimeStr}
        utcDateStr={utcDateStr}
        userName={user?.fullName || "Captain"}
        criticalIssues={criticalIssues}
      />
    );
  }

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  // 3. USER Operational Dashboard View
  return (
    <UserDashboardView
      activeVesselId={activeVesselId}
      activeVesselName={activeVesselName}
      utcTimeStr={utcTimeStr}
      utcDateStr={utcDateStr}
      userName={user?.fullName || "Officer"}
      metrics={metrics}
      overdueCount={overdueCount}
      upcomingCount={upcomingCount}
      dailyStats={dailyStats}
      dailyTasks={dailyTasks}
    />
  );
};

export default DashboardPage;
