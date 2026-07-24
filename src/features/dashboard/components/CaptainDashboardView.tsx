import React from "react";
import { Link } from "react-router";
import { ROUTES } from "../../../constants/routes";

interface CaptainDashboardViewProps {
  activeVesselName: string;
  utcTimeStr: string;
  utcDateStr: string;
  userName: string;
  criticalIssues: any[];
}

export const CaptainDashboardView: React.FC<CaptainDashboardViewProps> = ({
  activeVesselName,
  utcTimeStr,
  utcDateStr,
  userName,
  criticalIssues,
}) => {
  return (
    <div className="flex flex-col gap-6 w-full animate-fade-in pb-10 font-sans">
      {/* Captain Command Header */}
      <div className="bg-gradient-to-r from-blue-950 via-indigo-950 to-slate-900 text-white p-6 rounded-3xl shadow-xl border border-blue-800/40 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-300 bg-white/10 px-3 py-1 rounded-full border border-white/10">
            Captain Command Portal
          </span>
          <h1 className="text-2xl font-extrabold text-white tracking-tight mt-2">
            Vessel Command Cockpit — {activeVesselName} (Capt. {userName})
          </h1>
          <p className="text-xs text-blue-200/80 mt-1">
            Master Supervisor Portal: Oversee shipboard crew roster, approve joining authorizations, and monitor machinery compliance.
          </p>
        </div>
        <div className="flex flex-col items-end gap-1 font-mono text-xs">
          <span className="text-blue-300 font-bold">{utcTimeStr} UTC</span>
          <span className="text-zinc-400 text-[10px]">{utcDateStr}</span>
        </div>
      </div>

      {/* Pending Join Requests Alert Banner */}
      <div className="bg-amber-50 border border-amber-200/80 p-5 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-xl shadow-xs">
            📩
          </div>
          <div>
            <h4 className="text-xs font-extrabold text-amber-950 uppercase tracking-wider">
              Pending Crew Joining Authorizations Queue
            </h4>
            <p className="text-xs text-amber-800 mt-0.5 font-medium">
              Review and approve pending crew join applications via invite codes or QR passes.
            </p>
          </div>
        </div>
        <Link
          to={ROUTES.CREW}
          className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-extrabold rounded-xl transition cursor-pointer shadow-xs shrink-0"
        >
          Review Join Requests &rarr;
        </Link>
      </div>

      {/* Management Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          to={ROUTES.CREW}
          className="bg-white border border-zinc-200 p-5 rounded-2xl shadow-xs hover:border-sky-500 transition group flex flex-col justify-between gap-4"
        >
          <div>
            <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold text-lg mb-2">
              👥
            </div>
            <h4 className="text-sm font-extrabold text-black group-hover:text-sky-600 transition">
              Shipboard Crew Roster
            </h4>
            <p className="text-xs text-zinc-400 mt-1">
              Inspect active officers, reassign ranks, and monitor crew telemetry drawers.
            </p>
          </div>
          <span className="text-xs font-bold text-sky-600">Manage Roster &rarr;</span>
        </Link>

        <Link
          to={ROUTES.QR_INVITE}
          className="bg-white border border-zinc-200 p-5 rounded-2xl shadow-xs hover:border-indigo-500 transition group flex flex-col justify-between gap-4"
        >
          <div>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-lg mb-2">
              📱
            </div>
            <h4 className="text-sm font-extrabold text-black group-hover:text-indigo-600 transition">
              QR Code & Invite Pass
            </h4>
            <p className="text-xs text-zinc-400 mt-1">
              Generate joining QR codes and print shipboard invitation posters.
            </p>
          </div>
          <span className="text-xs font-bold text-indigo-600">Generate Passes &rarr;</span>
        </Link>

        <Link
          to={ROUTES.TEMPLATES}
          className="bg-white border border-zinc-200 p-5 rounded-2xl shadow-xs hover:border-emerald-500 transition group flex flex-col justify-between gap-4"
        >
          <div>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-lg mb-2">
              ⚙️
            </div>
            <h4 className="text-sm font-extrabold text-black group-hover:text-emerald-600 transition">
              Vessel Checklist Templates
            </h4>
            <p className="text-xs text-zinc-400 mt-1">
              Customize checklist categories, task definitions, and measurement units.
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-600">Configure Checklists &rarr;</span>
        </Link>
      </div>

      {/* Vessel Defect Alarms Telemetry */}
      {criticalIssues.length > 0 && (
        <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-xs flex flex-col gap-4">
          <h3 className="text-sm font-bold text-black border-b border-zinc-150 pb-3">
            Active Machinery Alarms & Breakdown Log
          </h3>
          <div className="flex flex-col gap-2">
            {criticalIssues.map((issue: any) => (
              <div
                key={issue.id || issue._id}
                className="p-3.5 bg-red-50/60 border border-red-200 rounded-xl flex justify-between items-center text-xs"
              >
                <div className="flex flex-col gap-0.5">
                  <span className="font-bold text-red-950">{issue.description}</span>
                  <span className="text-[10px] text-red-600 font-mono">Severity: {issue.severity}</span>
                </div>
                <Link
                  to={ROUTES.ISSUES}
                  className="px-3 py-1.5 bg-red-600 text-white font-bold text-[10px] rounded-lg hover:bg-red-700 transition"
                >
                  Inspect Defect
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CaptainDashboardView;
