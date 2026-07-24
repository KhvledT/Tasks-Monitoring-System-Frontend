import React from "react";
import type { HistoryItem } from "../types/history.types";
import { HistoryStatusBadge } from "./HistoryStatusBadge";
import { formatDateTime } from "../../../shared/utils/date";
import { motion, AnimatePresence } from "framer-motion";

interface HistoryDetailsDrawerProps {
  isOpen: boolean;
  item: HistoryItem | null;
  onClose: () => void;
}

export const HistoryDetailsDrawer: React.FC<HistoryDetailsDrawerProps> = ({
  isOpen,
  item,
  onClose,
}) => {
  return (
    <AnimatePresence>
      {isOpen && item && (
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
                  <h3 className="text-sm font-bold text-zinc-100 tracking-tight">
                    Audit Log Details
                  </h3>
                  <p className="text-[11px] text-zinc-450 mt-0.5">
                    Comprehensive audit trail logs information
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
              <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-5">
                {/* Linked task section */}
                <div className="bg-zinc-900/30 border border-zinc-900/60 p-4 rounded-xl">
                  <span className="text-[9px] font-bold text-sky-400 uppercase tracking-wider block mb-1">
                    Linked Task Title
                  </span>
                  <p className="text-xs font-bold text-zinc-150 leading-snug">
                    {item.title}
                  </p>
                  <span className="text-[10px] text-zinc-550 block mt-2">
                    Category:{" "}
                    <span className="font-semibold text-zinc-400">
                      {item.categoryName}
                    </span>
                  </span>
                </div>

                {/* Status and date logged */}
                <div className="flex flex-col gap-4 border-b border-zinc-900/40 pb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                      Execution Status
                    </span>
                    <HistoryStatusBadge status={item.status} />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                      Date Logged (UTC)
                    </span>
                    <span className="text-xs font-semibold text-zinc-200 font-mono">
                      {formatDateTime(item.issueDate)}
                    </span>
                  </div>
                </div>

                {/* Signed-off officer details */}
                <div className="flex flex-col gap-2 border-b border-zinc-900/40 pb-4">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                    Responsible Sign-off Officer
                  </span>
                  <div className="flex items-center gap-3 bg-zinc-900/20 border border-zinc-900 p-3 rounded-xl">
                    <div className="w-8 h-8 rounded-full bg-zinc-900/60 border border-zinc-800 flex items-center justify-center font-bold text-xs text-sky-450">
                      {item.completedBy.fullName.charAt(0)}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-zinc-250">
                        {item.completedBy.fullName}
                      </span>
                      <span className="text-[10px] text-zinc-500 font-medium">
                        {item.completedBy.rank}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Verification notes */}
                {item.notes && (
                  <div className="flex flex-col gap-1.5 border-b border-zinc-900/40 pb-4">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                      Verification Notes
                    </span>
                    <p className="text-xs text-zinc-300 font-medium leading-relaxed bg-zinc-900/10 p-3 rounded-lg border border-zinc-900/30">
                      {item.notes}
                    </p>
                  </div>
                )}

                {/* Measurements */}
                {item.measurement && (
                  <div className="flex flex-col gap-1.5 border-b border-zinc-900/40 pb-4">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                      Measurement Reading
                    </span>
                    <p className="text-xs font-mono text-sky-450 font-bold bg-zinc-900/10 p-3 rounded-lg border border-zinc-900/30">
                      {item.measurement}
                    </p>
                  </div>
                )}

                {/* Postponed justification */}
                {item.postponedReason && (
                  <div className="flex flex-col gap-1.5 border-b border-zinc-900/40 pb-4">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                      Postponement Reason
                    </span>
                    <p className="text-xs text-amber-500/90 font-medium leading-relaxed bg-zinc-900/10 p-3 rounded-lg border border-amber-900/20">
                      {item.postponedReason}
                    </p>
                  </div>
                )}

                {/* Reported Machinery Defect Details */}
                {item.issue && (
                  <div className="flex flex-col gap-2.5 bg-red-950/30 border border-red-900/50 p-4 rounded-xl">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider">
                        ⚠️ Defect ({item.issue.severity})
                      </span>
                      <span className="text-[10px] font-bold text-red-300 bg-red-900/40 px-2 py-0.5 rounded border border-red-800/40">
                        {item.issue.status}
                      </span>
                    </div>
                    <p className="text-xs text-red-200 font-medium leading-relaxed">
                      {item.issue.description}
                    </p>
                    {item.issue.note && (
                      <p className="text-[11px] text-zinc-400 italic">
                        Note: {item.issue.note}
                      </p>
                    )}
                    {item.issue.imageUrl && (
                      <img
                        src={item.issue.imageUrl}
                        alt="Defect Attachment"
                        className="w-full h-36 object-cover rounded-lg border border-red-800/40 mt-1"
                      />
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default HistoryDetailsDrawer;
