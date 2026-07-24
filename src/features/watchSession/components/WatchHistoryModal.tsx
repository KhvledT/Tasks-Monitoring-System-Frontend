import React from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../../lib/axios";

interface WatchHistoryModalProps {
  vesselId: string;
  isOpen: boolean;
  onClose: () => void;
}

export const WatchHistoryModal: React.FC<WatchHistoryModalProps> = ({
  vesselId,
  isOpen,
  onClose,
}) => {
  const { data: watchLogs = [], isLoading, error } = useQuery({
    queryKey: ["watch-history", vesselId],
    queryFn: async () => {
      const response = await apiClient.get("/watch-session/history", {
        params: { vesselId },
      });
      return response.data?.result || response.data || [];
    },
    enabled: isOpen && !!vesselId,
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto font-sans">
      <div className="bg-white border border-zinc-200 rounded-3xl w-full max-w-3xl shadow-2xl p-6 flex flex-col gap-6 my-8 animate-in fade-in zoom-in duration-150">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-150 pb-4">
          <div>
            <span className="text-[10px] font-extrabold text-[#0055d4] uppercase tracking-wider bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
              Shift Audit & Logbook
            </span>
            <h2 className="text-xl font-extrabold text-black tracking-tight mt-1">
              Watch Session History Logs
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Review completed watch shifts, digital officer signatures, handover notes, and shift timelines.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-600 font-bold text-sm flex items-center justify-center transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Watch History Stream */}
        <div className="max-h-[60vh] overflow-y-auto flex flex-col gap-3">
          {isLoading ? (
            <div className="p-12 text-center text-xs text-zinc-400 italic bg-zinc-50 rounded-2xl border border-zinc-200">
              Fetching archived watch session logs...
            </div>
          ) : error ? (
            <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-600">
              Unable to load watch session history logbook.
            </div>
          ) : watchLogs.length === 0 ? (
            <div className="p-12 text-center text-xs text-zinc-400 italic bg-zinc-50 rounded-2xl border border-zinc-200">
              No completed watch sessions archived for this vessel yet.
            </div>
          ) : (
            watchLogs.map((session: any, idx: number) => (
              <div
                key={session._id || session.id || idx}
                className="bg-white border border-zinc-200 rounded-2xl p-4 flex flex-col gap-3 shadow-2xs hover:border-zinc-300 transition"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold uppercase bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      {session.status || "COMPLETED"}
                    </span>
                    <span className="text-xs font-bold text-black">
                      Watchkeeper: {session.watchkeeper?.fullName || session.watchkeeper?.email || "Deck Officer"}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-400">
                    {new Date(session.startedAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs bg-zinc-50 p-3 rounded-xl border border-zinc-150">
                  <div>
                    <span className="text-[9px] text-zinc-400 uppercase tracking-wider block">Started (UTC)</span>
                    <span className="font-mono font-bold text-zinc-800">
                      {new Date(session.startedAt).toLocaleTimeString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] text-zinc-400 uppercase tracking-wider block">Secured (UTC)</span>
                    <span className="font-mono font-bold text-zinc-800">
                      {session.endedAt ? new Date(session.endedAt).toLocaleTimeString() : "--:--"}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] text-zinc-400 uppercase tracking-wider block">Signature Status</span>
                    <span className="font-semibold text-emerald-700">
                      {session.signature ? "✓ Signed & Sealed" : "Secured"}
                    </span>
                  </div>
                </div>

                {session.notes && (
                  <p className="text-xs text-zinc-600 italic bg-blue-50/40 p-2.5 rounded-xl border border-blue-100">
                    <strong>Handover / Observation Notes:</strong> {session.notes}
                  </p>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-zinc-150 pt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-zinc-200 hover:bg-zinc-300 text-zinc-700 font-bold text-xs rounded-xl transition cursor-pointer"
          >
            Close History Logs
          </button>
        </div>
      </div>
    </div>
  );
};

export default WatchHistoryModal;
