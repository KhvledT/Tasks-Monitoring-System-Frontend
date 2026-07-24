import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";

interface AuditEvent {
  id: string;
  timestamp: string;
  operator: string;
  action: string;
  target: string;
  details: string;
  ipAddress: string;
}

export const AuditLogsPage: React.FC = () => {
  const [search, setSearch] = useState("");
  const [filterAction, setFilterAction] = useState("ALL");

  // Simulated Audit Logs Query
  const { data: auditLogs = [], isLoading } = useQuery<AuditEvent[]>({
    queryKey: ["audit-logs", search, filterAction],
    queryFn: async () => {
      // Sample operational audit logs data
      return [
        {
          id: "evt-001",
          timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
          operator: "Super Admin Custodian (superadmin@mtms.com)",
          action: "VIP Vessel Provisioned",
          target: "Container Vessel 'Oceanic Star'",
          details: "Created VIP vessel and generated invite code STAR-8921",
          ipAddress: "192.168.1.10",
        },
        {
          id: "evt-002",
          timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
          operator: "Super Admin Custodian (superadmin@mtms.com)",
          action: "Captain Assigned",
          target: "Vessel 'Oceanic Star'",
          details: "Assigned Captain John Smith (capt.john@mtms.com) as vessel owner",
          ipAddress: "192.168.1.10",
        },
        {
          id: "evt-003",
          timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
          operator: "Captain John Smith",
          action: "Crew Join Approved",
          target: "Crew Officer Alex (alex@mtms.com)",
          details: "Approved join request and assigned rank Chief Officer",
          ipAddress: "10.0.4.52",
        },
        {
          id: "evt-004",
          timestamp: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
          operator: "Super Admin Custodian",
          action: "Global Master Template Published",
          target: "Template 'Standard Machinery Checklists V2.1'",
          details: "Published version 2.1 master global checklist definitions",
          ipAddress: "192.168.1.10",
        },
      ];
    },
  });

  const filteredLogs = auditLogs.filter(
    (log) =>
      log.operator.toLowerCase().includes(search.toLowerCase()) ||
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.target.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto p-4 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded border border-indigo-200">
            Platform Custodian Security
          </span>
          <h1 className="text-2xl font-extrabold text-black tracking-tight mt-1">
            System Security & Audit Logs
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Real-time audit log timeline tracking all platform administrative actions, user changes, and Captain assignments.
          </p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white border border-zinc-200 rounded-2xl p-4 flex flex-col md:flex-row gap-4 justify-between items-center shadow-xs">
        <input
          type="text"
          placeholder="Search audit logs by operator, action, or target entity..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-96 bg-zinc-50 border border-zinc-200 px-3.5 py-2 text-xs font-semibold rounded-xl text-black focus:outline-none focus:border-indigo-500"
        />
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-zinc-400">Action Type:</span>
          <select
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            className="bg-zinc-50 border border-zinc-200 px-3 py-2 text-xs font-bold rounded-xl text-black cursor-pointer"
          >
            <option value="ALL">All Event Types</option>
            <option value="VIP Vessel Provisioned">VIP Provisioning</option>
            <option value="Captain Assigned">Captain Assignments</option>
            <option value="Crew Join Approved">Crew Approvals</option>
            <option value="Template Published">Template Publishing</option>
          </select>
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-xs overflow-hidden">
        {isLoading ? (
          <p className="text-xs text-zinc-400 italic">Loading audit security log events...</p>
        ) : filteredLogs.length === 0 ? (
          <p className="text-xs text-zinc-400 italic">No audit records matching criteria.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-150 text-[10px] uppercase font-extrabold text-zinc-400 tracking-wider">
                  <th className="py-3 px-4">Timestamp (UTC)</th>
                  <th className="py-3 px-4">Operator</th>
                  <th className="py-3 px-4">Action Event</th>
                  <th className="py-3 px-4">Target Entity</th>
                  <th className="py-3 px-4">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 text-xs font-semibold text-black">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-zinc-50 transition">
                    <td className="py-3.5 px-4 font-mono text-[11px] text-zinc-500">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-indigo-950">{log.operator}</td>
                    <td className="py-3.5 px-4">
                      <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md font-extrabold text-[10px] border border-indigo-200">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-zinc-600">{log.target}</td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-zinc-400">{log.ipAddress}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuditLogsPage;
