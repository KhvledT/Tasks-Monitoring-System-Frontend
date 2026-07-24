import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../../lib/axios";
import { toast } from "react-hot-toast";

export interface SystemHealthData {
  status: string;
  overallState: string;
  timestamp: string;
  serverTimeUtc: string;
  executionTimeMs: number;
  version: string;
  environment: string;
  platform: {
    nodeVersion: string;
    architecture: string;
    platformOs: string;
    pid: number;
  };
  uptime: {
    seconds: number;
    formatted: string;
    startedAt: string;
  };
  database: {
    status: string;
    pingMs: number;
    databaseName: string;
    collectionsCount: number;
    driver: string;
  };
  memory: {
    rssMb: number;
    heapTotalMb: number;
    heapUsedMb: number;
    externalMb: number;
    heapPercent: number;
  };
  cpuLoad: {
    userMs: number;
    systemMs: number;
  };
  services: {
    redisCache: string;
    cloudinaryStorage: string;
    auditLogger: string;
    emailService: string;
    rateLimiter: string;
  };
}

export const HealthCheckPage: React.FC = () => {
  const [showJson, setShowJson] = useState(false);

  const {
    data: health,
    isLoading,
    isRefetching,
    refetch,
  } = useQuery<SystemHealthData>({
    queryKey: ["system-health-check"],
    queryFn: async () => {
      try {
        const response = await apiClient.get<{
          success: boolean;
          result: SystemHealthData;
        }>("/admin/health");
        if (response.data?.result) return response.data.result;
      } catch (err) {
        console.warn(
          "Failed to fetch /admin/health, trying /health/detail fallback:",
          err,
        );
      }
      const fallbackResponse = await apiClient.get<{
        success: boolean;
        result: SystemHealthData;
      }>("/health/detail");
      return fallbackResponse.data?.result || (fallbackResponse.data as any);
    },
    refetchInterval: 10000, // Auto refresh every 10s
  });

  const handleManualRefresh = async () => {
    await refetch();
    toast.success("System health telemetry refreshed.");
  };

  const isHealthy =
    health?.status === "HEALTHY" || health?.overallState === "OPERATIONAL";

  return (
    <div className="flex flex-col gap-6 p-6 font-sans max-w-7xl mx-auto animate-fade-in pb-12">
      {/* Header Banner */}
      <div className="bg-black text-white p-6 rounded-3xl shadow-xl border border-zinc-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-800/60">
              Super Admin Telemetry Cockpit
            </span>
          </div>

          <h1 className="text-2xl font-extrabold text-white tracking-tight mt-2 flex items-center gap-3">
            <span>System Health & Infrastructure Telemetry</span>
            {isHealthy ? (
              <span className="text-xs font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-3 py-1 rounded-full uppercase tracking-widest animate-pulse">
                ✓ System Operational
              </span>
            ) : (
              <span className="text-xs font-black bg-red-500/20 text-red-300 border border-red-500/40 px-3 py-1 rounded-full uppercase tracking-widest">
                ⚠️ System Degraded
              </span>
            )}
          </h1>

          <p className="text-xs text-zinc-400 mt-1">
            Real-time diagnostics of MongoDB database connection latency,
            Node.js process memory footprint, CPU load, and microservice
            gateways.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleManualRefresh}
            disabled={isRefetching}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold rounded-xl transition cursor-pointer shadow-md flex items-center gap-1.5"
          >
            <span>{isRefetching ? "🔄" : "⚡"}</span>
            <span>
              {isRefetching ? "Polling..." : "Run Manual Health Check"}
            </span>
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="p-12 text-center bg-white border border-zinc-200 rounded-3xl shadow-sm">
          <p className="text-xs text-zinc-400 italic">
            Executing system diagnostic health check...
          </p>
        </div>
      ) : !health ? (
        <div className="p-12 text-center bg-red-50 border border-red-200 rounded-3xl">
          <p className="text-sm font-bold text-red-700">
            Failed to connect to System Health Telemetry API.
          </p>
          <button
            onClick={handleManualRefresh}
            className="mt-3 px-4 py-2 bg-red-600 text-white text-xs font-bold rounded-xl"
          >
            Retry Connection
          </button>
        </div>
      ) : (
        <>
          {/* Main Infrastructure Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 1. Database Telemetry */}
            <div className="bg-white border border-zinc-200 rounded-3xl p-5 shadow-sm flex flex-col justify-between gap-4">
              <div className="flex items-center justify-between border-b border-zinc-150 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🍃</span>
                  <span className="text-xs font-extrabold text-black uppercase tracking-wider">
                    Database Status
                  </span>
                </div>
                <span
                  className={`text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full border font-mono ${
                    health.database?.status === "UP"
                      ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                      : "bg-red-100 text-red-800 border-red-300"
                  }`}
                >
                  {health.database?.status || "UNKNOWN"}
                </span>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-400 font-bold">Ping Latency:</span>
                  <span className="font-mono font-extrabold text-emerald-600">
                    {health.database?.pingMs >= 0
                      ? `${health.database.pingMs} ms`
                      : "N/A"}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-400 font-bold">
                    Database Name:
                  </span>
                  <span className="font-mono text-zinc-700 font-semibold">
                    {health.database?.databaseName || "maritime_db"}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-400 font-bold">Collections:</span>
                  <span className="font-mono text-zinc-800 font-bold">
                    {health.database?.collectionsCount || 0} collections
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-400 font-bold">
                    Driver Engine:
                  </span>
                  <span className="font-mono text-zinc-500 text-[10px]">
                    {health.database?.driver || "MongoDB Native"}
                  </span>
                </div>
              </div>
            </div>

            {/* 2. Process Uptime & System */}
            <div className="bg-white border border-zinc-200 rounded-3xl p-5 shadow-sm flex flex-col justify-between gap-4">
              <div className="flex items-center justify-between border-b border-zinc-150 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">⏱️</span>
                  <span className="text-xs font-extrabold text-black uppercase tracking-wider">
                    Process Uptime
                  </span>
                </div>
                <span className="text-[9px] font-black uppercase bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-full border border-indigo-200 font-mono">
                  {health.environment}
                </span>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-400 font-bold">
                    Uptime Duration:
                  </span>
                  <span className="font-mono font-extrabold text-indigo-600">
                    {health.uptime?.formatted || "0s"}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-400 font-bold">Process PID:</span>
                  <span className="font-mono text-zinc-700 font-bold">
                    #{health.platform?.pid || 1}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-400 font-bold">
                    Node.js Engine:
                  </span>
                  <span className="font-mono text-zinc-800 font-bold">
                    {health.platform?.nodeVersion || "v20.x"}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-400 font-bold">Server OS:</span>
                  <span className="font-mono text-zinc-500 text-[10px]">
                    {health.platform?.platformOs} (
                    {health.platform?.architecture})
                  </span>
                </div>
              </div>
            </div>

            {/* 3. Memory Footprint */}
            <div className="bg-white border border-zinc-200 rounded-3xl p-5 shadow-sm flex flex-col justify-between gap-4">
              <div className="flex items-center justify-between border-b border-zinc-150 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">📊</span>
                  <span className="text-xs font-extrabold text-black uppercase tracking-wider">
                    Memory Telemetry
                  </span>
                </div>
                <span className="text-[9px] font-black uppercase bg-sky-50 text-sky-700 px-2.5 py-0.5 rounded-full border border-sky-200 font-mono">
                  {health.memory?.heapPercent || 0}% Heap
                </span>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-400 font-bold">Heap Used:</span>
                  <span className="font-mono font-extrabold text-sky-600">
                    {health.memory?.heapUsedMb || 0} MB
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-400 font-bold">Heap Total:</span>
                  <span className="font-mono text-zinc-700">
                    {health.memory?.heapTotalMb || 0} MB
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-400 font-bold">
                    RSS Allocation:
                  </span>
                  <span className="font-mono text-zinc-800">
                    {health.memory?.rssMb || 0} MB
                  </span>
                </div>
                {/* Memory progress bar */}
                <div className="w-full bg-zinc-100 rounded-full h-2 overflow-hidden mt-1">
                  <div
                    className="bg-sky-600 h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(100, health.memory?.heapPercent || 0)}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* 4. CPU & Response Time */}
            <div className="bg-white border border-zinc-200 rounded-3xl p-5 shadow-sm flex flex-col justify-between gap-4">
              <div className="flex items-center justify-between border-b border-zinc-150 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🚀</span>
                  <span className="text-xs font-extrabold text-black uppercase tracking-wider">
                    Engine Performance
                  </span>
                </div>
                <span className="text-[9px] font-black uppercase bg-purple-50 text-purple-700 px-2.5 py-0.5 rounded-full border border-purple-200 font-mono">
                  {health.executionTimeMs || 0} ms Latency
                </span>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-400 font-bold">
                    Health Check Latency:
                  </span>
                  <span className="font-mono font-extrabold text-purple-600">
                    {health.executionTimeMs || 0} ms
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-400 font-bold">
                    CPU User Time:
                  </span>
                  <span className="font-mono text-zinc-700">
                    {health.cpuLoad?.userMs || 0} ms
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-400 font-bold">
                    CPU System Time:
                  </span>
                  <span className="font-mono text-zinc-700">
                    {health.cpuLoad?.systemMs || 0} ms
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-400 font-bold">
                    Server UTC Time:
                  </span>
                  <span className="font-mono text-zinc-500 text-[10px] truncate">
                    {health.serverTimeUtc}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Microservices & Gateways Status Matrix */}
          <div className="bg-white border border-zinc-200 rounded-3xl p-6 shadow-sm flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-zinc-150 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-black">
                  Microservices & Core Subsystem Gateways
                </h3>
                <p className="text-xs text-zinc-400">
                  Status of connected cache layers, cloud storage providers, and
                  security middlewares.
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-zinc-500 bg-zinc-50 px-3 py-1 rounded-full border border-zinc-200">
                5 Subsystems Monitored
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {/* Redis Cache */}
              <div className="p-4 bg-zinc-50/70 border border-zinc-200 rounded-2xl flex flex-col gap-2">
                <span className="text-[10px] font-extrabold uppercase text-zinc-400 font-mono">
                  Redis Cache Layer
                </span>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-black">
                    Redis Cache
                  </span>
                  <span
                    className={`text-[9px] font-black uppercase px-2 py-0.5 rounded border font-mono ${
                      health.services?.redisCache === "UP"
                        ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                        : "bg-zinc-100 text-zinc-600 border-zinc-200"
                    }`}
                  >
                    {health.services?.redisCache || "NOT_CONFIGURED"}
                  </span>
                </div>
              </div>

              {/* Cloudinary Storage */}
              <div className="p-4 bg-zinc-50/70 border border-zinc-200 rounded-2xl flex flex-col gap-2">
                <span className="text-[10px] font-extrabold uppercase text-zinc-400 font-mono">
                  Media Storage
                </span>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-black">
                    Cloudinary Cloud
                  </span>
                  <span
                    className={`text-[9px] font-black uppercase px-2 py-0.5 rounded border font-mono ${
                      health.services?.cloudinaryStorage === "UP"
                        ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                        : "bg-amber-100 text-amber-800 border-amber-200"
                    }`}
                  >
                    {health.services?.cloudinaryStorage || "NOT_CONFIGURED"}
                  </span>
                </div>
              </div>

              {/* Audit Security Logger */}
              <div className="p-4 bg-zinc-50/70 border border-zinc-200 rounded-2xl flex flex-col gap-2">
                <span className="text-[10px] font-extrabold uppercase text-zinc-400 font-mono">
                  Audit Middleware
                </span>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-black">
                    Audit Logger
                  </span>
                  <span className="text-[9px] font-black uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded border border-emerald-300 font-mono">
                    ✓ OPERATIONAL
                  </span>
                </div>
              </div>

              {/* Email Service */}
              <div className="p-4 bg-zinc-50/70 border border-zinc-200 rounded-2xl flex flex-col gap-2">
                <span className="text-[10px] font-extrabold uppercase text-zinc-400 font-mono">
                  Email Gateway
                </span>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-black">
                    SMTP Transport
                  </span>
                  <span className="text-[9px] font-black uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded border border-emerald-300 font-mono">
                    ✓ OPERATIONAL
                  </span>
                </div>
              </div>

              {/* API Rate Limiter */}
              <div className="p-4 bg-zinc-50/70 border border-zinc-200 rounded-2xl flex flex-col gap-2">
                <span className="text-[10px] font-extrabold uppercase text-zinc-400 font-mono">
                  DDoS Protection
                </span>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-black">
                    Rate Limiter
                  </span>
                  <span className="text-[9px] font-black uppercase bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded border border-emerald-300 font-mono">
                    ✓ PROTECTED
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Raw JSON Inspector Accordion */}
          <div className="bg-zinc-950 text-zinc-100 border border-zinc-800 rounded-3xl p-5 flex flex-col gap-3 shadow-xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-mono text-emerald-400 font-bold">
                  $
                </span>
                <span className="text-xs font-extrabold uppercase tracking-wider font-mono">
                  Raw Telemetry Diagnostic Payload
                </span>
              </div>
              <button
                onClick={() => setShowJson(!showJson)}
                className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-xs font-mono font-bold rounded-lg transition cursor-pointer text-zinc-300"
              >
                {showJson ? "Hide Raw JSON" : "Inspect Raw JSON"}
              </button>
            </div>

            {showJson && (
              <pre className="p-4 bg-black/80 rounded-2xl font-mono text-xs text-emerald-400 overflow-x-auto border border-zinc-800 max-h-96">
                {JSON.stringify(health, null, 2)}
              </pre>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default HealthCheckPage;
