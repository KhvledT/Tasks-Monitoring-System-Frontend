import React, { useState, useEffect } from "react";
import { useActiveVessel } from "../../../shared/hooks/useActiveVessel";
import { crewApi, type JoinRequest } from "../api/crew.api";
import { toast } from "react-hot-toast";

import { useSocket } from "../../../providers/SocketProvider";

export const JoinRequestsPage: React.FC = () => {
  const { activeVesselId } = useActiveVessel();
  const { socket } = useSocket();
  const [requests, setRequests] = useState<JoinRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Approval modal
  const [selectedReq, setSelectedReq] = useState<JoinRequest | null>(null);
  const [assignedRank, setAssignedRank] = useState("Chief Officer");

  const loadRequests = async () => {
    if (!activeVesselId) return;
    setIsLoading(true);
    try {
      const res = await crewApi.listJoinRequests(activeVesselId);
      setRequests((res as any)?.result || res || []);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, [activeVesselId]);

  // Listen for real-time join applications via socket
  useEffect(() => {
    if (!socket) return;

    const handleJoinReq = () => {
      loadRequests();
    };

    socket.on("crew:join_requested", handleJoinReq);
    socket.on("new_notification", handleJoinReq);

    return () => {
      socket.off("crew:join_requested", handleJoinReq);
      socket.off("new_notification", handleJoinReq);
    };
  }, [socket, activeVesselId]);

  const handleApprove = async () => {
    if (!activeVesselId || !selectedReq) return;
    try {
      const reqId = selectedReq.id || selectedReq._id!;
      await crewApi.approveJoinRequest(activeVesselId, reqId, assignedRank);
      toast.success("Join request approved.");
      setSelectedReq(null);
      loadRequests();
    } catch (e: any) {
      toast.error(e.response?.data?.message || "Approval failed.");
    }
  };

  const handleReject = async (reqId: string) => {
    if (!activeVesselId) return;
    try {
      await crewApi.rejectJoinRequest(activeVesselId, reqId);
      toast.success("Join request rejected.");
      loadRequests();
    } catch (e: any) {
      toast.error("Rejection failed.");
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6 font-sans max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-black tracking-tight">Pending Join Requests</h1>
        <p className="text-xs text-zinc-400 mt-1">
          Captain authorization queue for crew members requesting access to this VIP vessel.
        </p>
      </div>

      <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm">
        {isLoading ? (
          <p className="text-xs text-zinc-400 italic">Loading requests...</p>
        ) : requests.length === 0 ? (
          <p className="text-xs text-zinc-400 italic text-center py-8">No pending join requests.</p>
        ) : (
          <div className="flex flex-col divide-y divide-zinc-100">
            {requests.map((r) => {
              const reqId = r.id || r._id!;
              return (
                <div key={reqId} className="py-4 flex items-center justify-between gap-4">
                  <div>
                    <h4 className="text-sm font-bold text-black">{r.user?.fullName || r.user?.email || "Applicant"}</h4>
                    <p className="text-xs text-zinc-400">{r.user?.email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedReq(r);
                        setAssignedRank("Chief Officer");
                      }}
                      className="px-3 py-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-200 text-xs font-bold rounded-xl cursor-pointer"
                    >
                      Approve Request
                    </button>
                    <button
                      onClick={() => handleReject(reqId)}
                      className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 text-xs font-bold rounded-xl cursor-pointer"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Approval Modal */}
      {selectedReq && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-zinc-200 rounded-2xl p-6 max-w-md w-full flex flex-col gap-4 shadow-2xl">
            <h3 className="text-sm font-bold text-black border-b border-zinc-150 pb-2">Approve Join Request</h3>
            <p className="text-xs text-zinc-500">
              Assign initial vessel rank to <span className="font-bold text-black">{selectedReq.user?.fullName || selectedReq.user?.email}</span>.
            </p>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-zinc-450 uppercase">Initial Rank</label>
              <select
                value={assignedRank}
                onChange={(e) => setAssignedRank(e.target.value)}
                className="bg-zinc-50 border border-zinc-200 p-2.5 text-xs font-semibold rounded-xl text-black"
              >
                <option value="Chief Officer">Chief Officer</option>
                <option value="Second Officer">Second Officer</option>
                <option value="Third Officer">Third Officer</option>
                <option value="Cadet">Cadet</option>
              </select>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-zinc-100">
              <button
                onClick={() => setSelectedReq(null)}
                className="px-4 py-2 bg-white border border-zinc-200 text-xs font-bold text-gray rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleApprove}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-xs font-bold text-white rounded-xl cursor-pointer"
              >
                Confirm Approval
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JoinRequestsPage;
