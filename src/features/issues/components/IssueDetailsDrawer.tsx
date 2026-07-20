import React, { useEffect, useState } from "react";
import type { IssueItem } from "../types/issue.types";
import { useDeleteIssue } from "../hooks/useDeleteIssue";
import { useUpdateIssue } from "../hooks/useUpdateIssue";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

interface IssueDetailsDrawerProps {
  isOpen: boolean;
  issue: IssueItem | null;
  onClose: () => void;
  isArchiveMode?: boolean;
}

export const IssueDetailsDrawer: React.FC<IssueDetailsDrawerProps> = ({
  isOpen,
  issue,
  onClose,
  isArchiveMode = false,
}) => {
  const deleteMutation = useDeleteIssue();
  const updateMutation = useUpdateIssue();

  // Form local state
  const [status, setStatus] = useState<'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED'>('OPEN');
  const [severity, setSeverity] = useState<'CRITICAL' | 'MAJOR' | 'MINOR' | 'OBSERVATION'>('MINOR');
  const [note, setNote] = useState('');
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Sync form state when issue changes
  useEffect(() => {
    if (issue) {
      setStatus(issue.status || 'OPEN');
      setSeverity(issue.severity || 'MINOR');
      setNote(issue.note || '');
      setResolutionNotes(issue.resolutionNotes || '');
    }
  }, [issue]);

  // Escape key handler to close the drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!issue) return;
    if (isArchiveMode) return;
    setIsSaving(true);
    try {
      await updateMutation.mutateAsync({
        issueId: issue.id,
        data: {
          status,
          severity,
          note,
          resolutionNotes: status === 'RESOLVED' || status === 'CLOSED' ? resolutionNotes : undefined,
        },
      });
      toast.success("Defect log updated successfully!");
      onClose();
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to save updates.";
      toast.error(msg);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!issue) return;
    if (isArchiveMode) return;
    if (
      !window.confirm("Are you sure you want to permanently delete this issue log?")
    )
      return;
    try {
      await deleteMutation.mutateAsync(issue.id);
      toast.success("Issue record deleted.");
      onClose();
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to delete issue.";
      toast.error(msg);
    }
  };

  const getFormattedDateString = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;

      const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
      ];

      const day = d.getDate();
      const month = months[d.getMonth()];
      const year = d.getFullYear();

      const hours = String(d.getHours()).padStart(2, "0");
      const minutes = String(d.getMinutes()).padStart(2, "0");

      return `${day} ${month} ${year} at ${hours}:${minutes} UTC`;
    } catch {
      return dateStr;
    }
  };

  const getSeverityBadgeClass = (sev: string) => {
    switch (sev) {
      case "CRITICAL":
        return "bg-red-955/40 text-red-450 border-red-900/30";
      case "MAJOR":
        return "bg-amber-955/40 text-amber-450 border-amber-900/30";
      case "MINOR":
        return "bg-blue-955/40 text-blue-450 border-blue-900/30";
      default:
        return "bg-zinc-900/60 text-zinc-400 border-zinc-800";
    }
  };

  const getStatusBadgeClass = (st: string) => {
    switch (st) {
      case "OPEN":
        return "bg-red-955/20 text-red-400 border-red-900/10";
      case "IN_PROGRESS":
        return "bg-amber-955/20 text-amber-400 border-amber-900/10";
      case "RESOLVED":
        return "bg-emerald-955/20 text-emerald-450 border-emerald-900/10";
      case "CLOSED":
        return "bg-zinc-900 text-zinc-400 border-zinc-800";
      default:
        return "bg-zinc-900 text-zinc-400 border-zinc-800";
    }
  };

  return (
    <AnimatePresence>
      {isOpen && issue && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-xs cursor-pointer"
          />

          {/* Drawer container sliding from right */}
          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10 pointer-events-none">
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-screen max-w-md bg-zinc-950 border-l border-zinc-900 pointer-events-auto flex flex-col shadow-2xl h-full"
            >
              {/* Drawer Header */}
              <div className="px-6 py-5 border-b border-zinc-900 flex items-center justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-bold text-zinc-100 tracking-tight">
                      Defect Work Log
                    </h3>
                    <span className={`text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border shrink-0 ${getSeverityBadgeClass(issue.severity || 'MINOR')}`}>
                      {issue.severity || 'MINOR'}
                    </span>
                    <span className={`text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border shrink-0 ${getStatusBadgeClass(issue.status || 'OPEN')}`}>
                      {issue.status || 'OPEN'}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-450 mt-0.5">
                    Resolve, edit severity, and monitor log history
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-1 rounded-lg text-zinc-500 hover:bg-zinc-900 hover:text-zinc-200 transition cursor-pointer"
                  aria-label="Close drawer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18 18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Scrollable details area */}
              <form onSubmit={handleSaveChanges} className="flex-1 overflow-y-auto p-6 flex flex-col gap-5">
                {/* Meta details grid */}
                <div className="grid grid-cols-2 gap-4 bg-zinc-950/40 p-4 border border-zinc-900 rounded-xl text-[11px]">
                  <div className="flex flex-col gap-0.5 col-span-2 border-b border-zinc-900/60 pb-2">
                    <span className="text-[9px] text-zinc-550 uppercase tracking-wider font-bold">Related Task Record</span>
                    <span className="text-zinc-200 font-semibold">{issue.taskTitle}</span>
                  </div>

                  <div className="flex flex-col gap-0.5">
                    <span className="text-[9px] text-zinc-550 uppercase tracking-wider font-bold">Reporter</span>
                    <span className="text-zinc-300 font-semibold">{issue.reporterName}</span>
                  </div>

                  <div className="flex flex-col gap-0.5">
                    <span className="text-[9px] text-zinc-550 uppercase tracking-wider font-bold">Watch Session</span>
                    <span className="text-zinc-400 font-mono text-[9px] truncate">
                      {issue.watchSessionId ? `ID: ${issue.watchSessionId.substring(0, 10)}...` : "System/Offline"}
                    </span>
                  </div>

                  <div className="flex flex-col gap-0.5 col-span-2 border-t border-zinc-900/60 pt-2">
                    <span className="text-[9px] text-zinc-550 uppercase tracking-wider font-bold">Logged On</span>
                    <span className="text-zinc-300 font-mono">{getFormattedDateString(issue.issueDate)}</span>
                  </div>

                  {issue.updatedAt && (
                    <div className="flex flex-col gap-0.5 col-span-2 border-t border-zinc-900/40 pt-2">
                      <span className="text-[9px] text-zinc-550 uppercase tracking-wider font-bold">Last Sync/Update</span>
                      <span className="text-zinc-400 font-mono">{getFormattedDateString(issue.updatedAt)}</span>
                    </div>
                  )}
                </div>

                {/* Description info */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                    Defect Description
                  </span>
                  <p className="text-xs text-zinc-250 font-medium leading-relaxed bg-zinc-900/30 p-3.5 rounded-xl border border-zinc-900">
                    {issue.description}
                  </p>
                </div>

                {/* Status selector */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="issue-status" className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                    Execution Status
                  </label>
                  <select
                    id="issue-status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    disabled={isArchiveMode}
                    className="w-full text-xs font-semibold p-3 bg-zinc-950 border border-zinc-900 text-zinc-200 rounded-xl focus:border-sky-500/50 focus:outline-none transition cursor-pointer disabled:opacity-50"
                  >
                    <option value="OPEN">🔴 Open (Pending Action)</option>
                    <option value="IN_PROGRESS">🟡 In Progress (Assigned)</option>
                    <option value="RESOLVED">🟢 Resolved (Verification Needed)</option>
                    <option value="CLOSED">⚪ Closed (Archived)</option>
                  </select>
                </div>

                {/* Severity selector */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="issue-severity" className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                    Severity Level
                  </label>
                  <select
                    id="issue-severity"
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value as any)}
                    disabled={isArchiveMode}
                    className="w-full text-xs font-semibold p-3 bg-zinc-950 border border-zinc-900 text-zinc-200 rounded-xl focus:border-sky-500/50 focus:outline-none transition cursor-pointer disabled:opacity-50"
                  >
                    <option value="CRITICAL">🚨 CRITICAL (Emergency Alert)</option>
                    <option value="MAJOR">⚠️ MAJOR (Degraded Operation)</option>
                    <option value="MINOR">🔧 MINOR (Maintenance Action)</option>
                    <option value="OBSERVATION">📋 OBSERVATION (General Log)</option>
                  </select>
                </div>

                {/* Internal notes */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="issue-notes" className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                    Internal Notes & History
                  </label>
                  <textarea
                    id="issue-notes"
                    rows={3}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    disabled={isArchiveMode}
                    placeholder="Enter notes about investigation, parts ordered, actions taken..."
                    className="w-full text-xs font-medium p-3 bg-zinc-950 border border-zinc-900 text-zinc-300 rounded-xl focus:border-sky-500/50 focus:outline-none transition placeholder-zinc-700 leading-normal disabled:opacity-50"
                  />
                </div>

                {/* Resolution Notes (Visible when RESOLVED or CLOSED) */}
                {(status === 'RESOLVED' || status === 'CLOSED') && (
                  <div className="flex flex-col gap-1.5 border-t border-zinc-900/60 pt-4 animate-fade-in">
                    <label htmlFor="issue-resolution" className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                      Resolution Audit Notes
                    </label>
                    <textarea
                      id="issue-resolution"
                      rows={3}
                      value={resolutionNotes}
                      onChange={(e) => setResolutionNotes(e.target.value)}
                      disabled={isArchiveMode}
                      placeholder="Detail how the issue was fixed, tools/methods used, officer signatures..."
                      className="w-full text-xs font-medium p-3 bg-zinc-950 border border-zinc-900 text-zinc-300 rounded-xl focus:border-sky-500/50 focus:outline-none transition placeholder-zinc-700 leading-normal disabled:opacity-50"
                      required
                    />
                  </div>
                )}

                {/* Photo attachment if available */}
                {issue.imageUrl && (
                  <div className="flex flex-col gap-2 border-t border-zinc-900 pt-4">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                      Photo Evidence Attachment
                    </span>
                    <div className="relative rounded-xl overflow-hidden border border-zinc-800 bg-black/40 aspect-video group">
                      <img
                        src={issue.imageUrl}
                        alt="Issue Attachment Evidence"
                        className="w-full h-full object-cover group-hover:scale-[1.02] transition duration-300"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = "none";
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Actions group */}
                <div className="border-t border-zinc-900 pt-5 mt-auto">
                  {isArchiveMode ? (
                    <div className="p-4 bg-zinc-900/20 border border-zinc-900 rounded-xl text-center text-xs text-zinc-450 italic font-semibold leading-normal">
                      Defect details are read-only in historical archive workspace.
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2.5">
                      <button
                        type="submit"
                        disabled={isSaving}
                        className="w-full font-bold px-4 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-black active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                      >
                        {isSaving ? "Saving Updates..." : "Save Workspace Updates"}
                      </button>

                      <button
                        type="button"
                        onClick={handleDelete}
                        disabled={deleteMutation.isPending}
                        className="w-full font-bold px-4 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-850/80 border border-zinc-800 text-red-400 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                      >
                        Delete Log Record
                      </button>
                    </div>
                  )}
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default IssueDetailsDrawer;
