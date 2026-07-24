import React from "react";
import { Link } from "react-router";
import { ROUTES } from "../../../constants/routes";

interface SuperAdminDashboardViewProps {
  userName: string;
}

export const SuperAdminDashboardView: React.FC<
  SuperAdminDashboardViewProps
> = ({ userName }) => {
  return (
    <div className="flex flex-col gap-6 w-full animate-fade-in pb-10 font-sans max-w-7xl mx-auto p-4 md:p-8">
      {/* Super Admin Command Header */}
      <div className="bg-gradient-to-r from-black via-slate-900 to-indigo-950 text-white p-6 rounded-3xl shadow-xl border border-zinc-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-300 bg-white/10 px-3 py-1 rounded-full border border-white/10">
            Platform Custodian Administration
          </span>
          <h1 className="text-2xl font-extrabold text-white tracking-tight mt-2">
            Global Fleet Operations Command Center — {userName}
          </h1>
          <p className="text-xs text-zinc-700 mt-1">
            System Custodian Portal: Manage user accounts, provision VIP
            vessels, assign Captains, and monitor platform security logs.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to={ROUTES.WORKSPACE_HOME}
            className="px-4 py-2.5 bg-[#0055d4] hover:bg-[#003fa3] text-white text-xs font-bold rounded-xl transition shadow-md"
          >
            Workspace Command Hub &rarr;
          </Link>
        </div>
      </div>

      {/* Primary Custodian Navigation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Link
          to={ROUTES.USERS_MANAGEMENT}
          className="bg-white border border-zinc-200 p-5 rounded-2xl shadow-xs hover:border-indigo-500 transition group flex flex-col justify-between gap-4"
        >
          <div>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-lg mb-2">
              👥
            </div>
            <h4 className="text-sm font-extrabold text-black group-hover:text-indigo-600 transition">
              Users Directory
            </h4>
            <p className="text-xs text-zinc-400 mt-1">
              Search accounts, activate/suspend users, and promote Users to
              Captains.
            </p>
          </div>
          <span className="text-xs font-bold text-indigo-600">
            Manage Users &rarr;
          </span>
        </Link>

        <Link
          to={ROUTES.CAPTAINS_MANAGEMENT}
          className="bg-white border border-zinc-200 p-5 rounded-2xl shadow-xs hover:border-sky-500 transition group flex flex-col justify-between gap-4"
        >
          <div>
            <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold text-lg mb-2">
              ⚓
            </div>
            <h4 className="text-sm font-extrabold text-black group-hover:text-sky-600 transition">
              Captains Directory
            </h4>
            <p className="text-xs text-zinc-400 mt-1">
              Monitor active Captains, transfer vessel ownership, and demote
              Captains.
            </p>
          </div>
          <span className="text-xs font-bold text-sky-600">
            Captains Module &rarr;
          </span>
        </Link>

        <Link
          to={ROUTES.VIP_VESSELS}
          className="bg-white border border-zinc-200 p-5 rounded-2xl shadow-xs hover:border-emerald-500 transition group flex flex-col justify-between gap-4"
        >
          <div>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-lg mb-2">
              🚢
            </div>
            <h4 className="text-sm font-extrabold text-black group-hover:text-emerald-600 transition">
              VIP Vessels
            </h4>
            <p className="text-xs text-zinc-400 mt-1">
              Inspect fleet VIP ships, lifecycle status, and ownership
              transfers.
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-600">
            View VIP Fleet &rarr;
          </span>
        </Link>

        <Link
          to={ROUTES.HEALTH_CHECK}
          className="bg-white border border-zinc-200 p-5 rounded-2xl shadow-xs hover:border-amber-500 transition group flex flex-col justify-between gap-4"
        >
          <div>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-lg mb-2">
              ⚡
            </div>
            <h4 className="text-sm font-extrabold text-black group-hover:text-amber-600 transition">
              System Health Check
            </h4>
            <p className="text-xs text-zinc-400 mt-1">
              Real-time database ping, process uptime, memory telemetry, and
              server status.
            </p>
          </div>
          <span className="text-xs font-bold text-amber-600">
            Health Check &rarr;
          </span>
        </Link>
      </div>
    </div>
  );
};

export default SuperAdminDashboardView;
