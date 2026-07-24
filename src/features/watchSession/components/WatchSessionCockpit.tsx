import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import {
  useActiveWatch,
  useStartWatch,
  usePauseWatch,
  useResumeWatch,
  useHandoverWatch,
  useCompleteWatch,
} from "../hooks/useWatchSession";
import { useActiveVessel } from "../../../shared/hooks/useActiveVessel";
import { HandoverWatchModal } from "./HandoverWatchModal";
import { CompleteWatchModal } from "./CompleteWatchModal";

interface WatchSessionCockpitProps {
  vesselId: string;
}

export const WatchSessionCockpit: React.FC<WatchSessionCockpitProps> = ({
  vesselId,
}) => {
  const { isOperationalActive, vesselMode, hasRequestedLeave } = useActiveVessel();
  const isPersonalVessel = vesselMode?.toLowerCase() === "personal";
  const { data: watch, isLoading, error } = useActiveWatch(vesselId);
  const startMutation = useStartWatch();
  const pauseMutation = usePauseWatch();
  const resumeMutation = useResumeWatch();
  const handoverMutation = useHandoverWatch();
  const completeMutation = useCompleteWatch();

  const [isHandoverOpen, setIsHandoverOpen] = useState(false);
  const [isCompleteOpen, setIsCompleteOpen] = useState(false);
  const [elapsed, setElapsed] = useState("");
  const [elapsedParts, setElapsedParts] = useState({
    h: "00",
    m: "00",
    s: "00",
  });
  const [modalError, setModalError] = useState<string | null>(null);

  // Live watch session duration timer
  useEffect(() => {
    if (!watch || !watch.startedAt || watch.status === "COMPLETED") {
      setElapsed("");
      setElapsedParts({ h: "00", m: "00", s: "00" });
      return;
    }

    const calculateElapsed = () => {
      const start = new Date(watch.startedAt).getTime();
      let now = new Date().getTime();

      if (watch.status === "PAUSED") {
        if (watch.pausedAt) {
          now = new Date(watch.pausedAt).getTime();
        } else if (watch.updatedAt) {
          now = new Date(watch.updatedAt).getTime();
        }
      }

      const totalPaused = watch.totalPausedMs || 0;
      const diff = Math.max(0, now - start - totalPaused);

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setElapsedParts({
        h: String(hours).padStart(2, "0"),
        m: String(minutes).padStart(2, "0"),
        s: String(seconds).padStart(2, "0"),
      });

      if (hours > 0) {
        setElapsed(`${hours}h ${minutes}m`);
      } else {
        setElapsed(`${minutes}m`);
      }
    };

    calculateElapsed();

    if (watch.status === "PAUSED") {
      return; // Freeze timer and do not start interval when paused
    }

    const interval = setInterval(calculateElapsed, 1000);
    return () => clearInterval(interval);
  }, [watch]);

  // Auto-start watch session from checklists offline warning redirection link
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (
      params.get("startWatch") === "true" &&
      watch === null &&
      !startMutation.isPending
    ) {
      window.history.replaceState({}, document.title, window.location.pathname);
      handleStart();
    }
  }, [watch]);

  if (isLoading) {
    return (
      <div className="w-full bg-white border border-zinc-200 rounded-2xl p-6 animate-pulse flex flex-col gap-3 shadow-sm">
        <div className="h-4 bg-zinc-100 rounded w-1/4" />
        <div className="h-8 bg-zinc-100 rounded w-full" />
      </div>
    );
  }

  if (error) {
    return null; // Silent fail to avoid crashing dashboard page
  }

  const handleStart = async () => {
    if (!isOperationalActive) {
      toast.error("Cannot start watch session: Vessel is not in Active operational status.");
      return;
    }
    try {
      await startMutation.mutateAsync(vesselId);
      toast.success("Watch session initialized!");
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || "Failed to start watch session.",
      );
    }
  };

  const handlePause = async () => {
    if (!watch) return;
    try {
      await pauseMutation.mutateAsync(watch._id);
      toast.success("Watch session paused.");
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || "Failed to pause watch session.",
      );
    }
  };

  const handleResume = async () => {
    if (!watch) return;
    try {
      await resumeMutation.mutateAsync(watch._id);
      toast.success("Watch session resumed.");
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || "Failed to resume watch session.",
      );
    }
  };

  const handleHandoverSubmit = async (data: {
    incomingOfficerEmail: string;
    incomingOfficerPassword: string;
    notes?: string;
  }) => {
    if (!watch) return;
    setModalError(null);
    try {
      await handoverMutation.mutateAsync({ sessionId: watch._id, data });
      setIsHandoverOpen(false);
      toast.success("Watch signed over successfully!");
    } catch (err: any) {
      const msg = err.response?.data?.message || "Handover failed.";
      setModalError(msg);
      toast.error(msg);
    }
  };

  const handleCompleteSubmit = async (data: {
    signature: string;
    notes?: string;
  }) => {
    if (!watch) return;
    setModalError(null);
    try {
      await completeMutation.mutateAsync({ sessionId: watch._id, data });
      setIsCompleteOpen(false);
      toast.success("Watch session secured and log archived.");
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to complete watch.";
      setModalError(msg);
      toast.error(msg);
    }
  };

  // Render Start Watch Cockpit if no active watchkeeper session exists
  if (!watch) {
    return (
      <div className="w-full bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
        <div>
          <h2 className="text-sm font-bold text-black tracking-tight flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-zinc-300 rounded-full animate-pulse" />
            Watch Logs Offline
          </h2>
          <p className="text-xs text-zinc-500 mt-1 max-w-lg leading-relaxed">
            No active watchkeeper context is initialized for this vessel
            workspace. Initiate logs to record inspections and report machinery
            defects.
          </p>
        </div>
        {isOperationalActive ? (
          <button
            id="watchkeeping-cockpit-start-btn"
            onClick={handleStart}
            disabled={startMutation.isPending}
            className="w-full md:w-auto px-5 py-2.5 bg-primary hover:bg-[#003fa3] disabled:opacity-50 text-xs font-bold text-white rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
          >
            Initialize Watch Shift
          </button>
        ) : (
          <span className="text-xs font-bold text-amber-800 bg-amber-50 px-3.5 py-2 rounded-xl border border-amber-200">
            {hasRequestedLeave ? "🔒 Read-Only (Leave Request Pending)" : "🔒 Read-Only (Vessel Inactive)"}
          </span>
        )}
      </div>
    );
  }

  // Active watch keeper cockpit details view
  const statusColor: Record<string, string> = {
    STARTED: "bg-zinc-100 text-zinc-600 border-zinc-200",
    ACTIVE: "bg-emerald-50 text-emerald-600 border-emerald-200",
    PAUSED: "bg-amber-50 text-amber-600 border-amber-200",
    HANDED_OVER: "bg-sky-50 text-sky-600 border-sky-200",
  };

  const startTimeFormatted = watch.startedAt
    ? new Date(watch.startedAt).toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        timeZone: "UTC",
      })
    : "--:--:--";

  return (
    <div className="w-full bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm flex flex-col gap-5 mb-4">
      {/* Top Row: Session info + elapsed timer */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        {/* Left: Session info */}
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-blue-50 border border-primary/20 rounded-xl flex items-center justify-center text-primary shrink-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.8}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25A2.25 2.25 0 0 1 5.25 3h13.5A2.25 2.25 0 0 1 21 5.25Z"
              />
            </svg>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-1">
              <span
                className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${statusColor[watch.status] || "bg-zinc-100 text-zinc-600 border-zinc-200"}`}
              >
                {watch.status || "Active Session"}
              </span>
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            </div>
            <h2 className="text-xl font-bold text-black tracking-tight">
              Watchkeeping Cockpit
            </h2>
          </div>
        </div>

        {/* Right: Elapsed time counter */}
        <div className="flex flex-col items-end gap-0.5">
          <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">
            {elapsed ? "Duration" : "Elapsed Time"}
          </span>
          <span className="text-4xl font-extrabold text-black font-mono tracking-tighter">
            {elapsedParts.h}
            <span className="text-zinc-300">:</span>
            {elapsedParts.m}
            <span className="text-zinc-300">:</span>
            {elapsedParts.s}
          </span>
        </div>
      </div>

      {/* Session Details Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 border-t border-zinc-100 pt-4">
        <div>
          <span className="text-[9px] text-zinc-400 uppercase tracking-wider block mb-0.5">
            Watchkeeper
          </span>
          <span className="text-sm text-black font-semibold">
            {(watch as any).watchkeeper?.fullName || "Current Officer"}
          </span>
        </div>
        <div>
          <span className="text-[9px] text-zinc-400 uppercase tracking-wider block mb-0.5">
            Start Time (UTC)
          </span>
          <span className="text-sm text-black font-semibold font-mono">
            {startTimeFormatted}
          </span>
        </div>
        <div>
          <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider block mb-0.5">
            Relief Expected
          </span>
          <span className="text-sm text-black font-mono">--:--:--</span>
        </div>
      </div>

      {/* Action Buttons Row */}
      <div className="flex flex-wrap items-center gap-3 border-t border-zinc-100 pt-4">
        {watch.status === "PAUSED" ? (
          <button
            onClick={handleResume}
            disabled={resumeMutation.isPending}
            className="px-4 py-2.5 bg-[#0055d4] hover:bg-[#003fa3] text-xs font-bold text-white rounded-xl transition cursor-pointer flex items-center gap-1.5"
          >
            ▶ Resume Watch
          </button>
        ) : (
          <button
            onClick={handlePause}
            disabled={pauseMutation.isPending}
            className="px-4 py-2.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-xs font-bold text-amber-800 rounded-xl transition cursor-pointer flex items-center gap-1.5"
          >
            ⏸ Pause Watch
          </button>
        )}

        {!isPersonalVessel && (
          <button
            onClick={() => setIsHandoverOpen(true)}
            className="px-4 py-2.5 bg-sky-50 hover:bg-sky-100 border border-sky-200 text-xs font-bold text-sky-800 rounded-xl transition cursor-pointer flex items-center gap-1.5"
          >
            🔄 Handover Watch
          </button>
        )}

        <button
          onClick={() => setIsCompleteOpen(true)}
          className="px-5 py-2.5 bg-red-50 hover:bg-red-100 border border-red-200 text-xs font-bold text-red-600 rounded-xl transition flex items-center gap-2 cursor-pointer ml-auto"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75"
            />
          </svg>
          Complete Watch
        </button>
      </div>

      {watch.notes && (
        <div className="bg-zinc-50 border border-zinc-200 p-3.5 rounded-xl text-xs text-zinc-600 italic">
          <strong>Observation Notes:</strong> {watch.notes}
        </div>
      )}

      {/* Handover & Completion Modals */}
      <HandoverWatchModal
        isOpen={isHandoverOpen}
        isLoading={handoverMutation.isPending}
        errorMsg={modalError}
        onSubmit={handleHandoverSubmit}
        onCancel={() => {
          setIsHandoverOpen(false);
          setModalError(null);
        }}
      />

      <CompleteWatchModal
        isOpen={isCompleteOpen}
        isLoading={completeMutation.isPending}
        errorMsg={modalError}
        onSubmit={handleCompleteSubmit}
        onCancel={() => {
          setIsCompleteOpen(false);
          setModalError(null);
        }}
      />
    </div>
  );
};

export default WatchSessionCockpit;
