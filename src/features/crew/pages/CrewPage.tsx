import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router";
import { useActiveVessel } from "../../../shared/hooks/useActiveVessel";
import { useAuth } from "../../../shared/hooks/useAuth";
import { crewApi, type CrewMember } from "../api/crew.api";
import { vesselApi } from "../../vessel/api/vessel.api";
import { CrewDetailDrawer } from "../components/CrewDetailDrawer";
import { toast } from "react-hot-toast";
import { apiClient } from "../../../lib/axios";
import { ImagePreviewModal } from "../../../shared/components/ImagePreviewModal";
import { useSocket } from "../../../providers/SocketProvider";

const MARITIME_RANKS = [
  "Captain",
  "Chief Officer",
  "Second Officer",
  "Third Officer",
  "Bosun",
  "Able Seaman",
  "Ordinary Seaman",
  "Cadet",
];

export const CrewPage: React.FC = () => {
  const { activeVesselId, activeVessel } = useActiveVessel();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { socket } = useSocket();
  const [searchParams] = useSearchParams();

  // Real-time socket listener for roster, join requests, and leave requests
  useEffect(() => {
    if (!socket) return;

    const handleRosterUpdate = () => {
      queryClient.invalidateQueries({ queryKey: ["vessel-crew"] });
      queryClient.invalidateQueries({ queryKey: ["vessel-join-requests"] });
      queryClient.invalidateQueries({ queryKey: ["leave-requests"] });
    };

    socket.on("crew:join_requested", handleRosterUpdate);
    socket.on("crew:leave_requested", handleRosterUpdate);
    socket.on("new_notification", handleRosterUpdate);

    return () => {
      socket.off("crew:join_requested", handleRosterUpdate);
      socket.off("crew:leave_requested", handleRosterUpdate);
      socket.off("new_notification", handleRosterUpdate);
    };
  }, [socket, queryClient]);

  const openCrewDrawerId = searchParams.get("openCrewDrawer") || searchParams.get("crewId");
  const drawerInitialTab = (searchParams.get("tab") as "completed" | "pending" | "issues") || "completed";

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedCrew, setSelectedCrew] = useState<CrewMember | null>(null);
  const [activeDrawerCrew, setActiveDrawerCrew] = useState<CrewMember | null>(null);
  const [newRank, setNewRank] = useState<string>("Second Officer");
  const [isRankModalOpen, setIsRankModalOpen] = useState(false);
  
  // Right side Request Tab selection for Captain: "join" | "leave"
  const [requestTab, setRequestTab] = useState<"join" | "leave">("join");

  // Approval Modal state (Join Request)
  const [approvingReq, setApprovingReq] = useState<{ id: string; name: string } | null>(null);
  const [initialRank, setInitialRank] = useState<string>("Cadet");

  // Replacement Modal state (Captain approves leave request by replacing officer)
  const [leavingCrewForReplace, setLeavingCrewForReplace] = useState<any | null>(null);
  const [selectedReplacementUserId, setSelectedReplacementUserId] = useState<string>("");

  // Inspection Drawer state
  const [isInspectOpen, setIsInspectOpen] = useState(false);
  const [inspectUserId, setInspectUserId] = useState<string | null>(null);

  const isCaptain = user?.role === "ADMIN" && activeVessel?.captainId === user?.id;
  const isVipVessel = activeVessel?.vesselMode === "VIP";

  // Realtime Backend Queries
  const { data: crew = [], isLoading: isCrewLoading } = useQuery({
    queryKey: ["crew", activeVesselId],
    queryFn: () => crewApi.listCrew(activeVesselId!),
    enabled: !!activeVesselId,
  });

  const myMembership = crew.find((c) => {
    const mUserId = typeof c.userId === "object" ? (c.userId as any)?._id : c.userId;
    return String(mUserId) === String(user?.id);
  });

  const hasRequestedLeave = (myMembership as any)?.hasRequestedLeave || false;

  useEffect(() => {
    if (openCrewDrawerId && crew.length > 0) {
      const match = crew.find(
        (c) =>
          c.id === openCrewDrawerId ||
          (c as any)._id === openCrewDrawerId ||
          c.userId === openCrewDrawerId ||
          (typeof c.userId === "object" && (c.userId as any)._id === openCrewDrawerId)
      );
      if (match) {
        setActiveDrawerCrew(match);
      }
    }
  }, [openCrewDrawerId, crew]);

  // Join Requests Query
  const { data: requests = [], isLoading: isRequestsLoading } = useQuery({
    queryKey: ["crew-requests", activeVesselId],
    queryFn: () => crewApi.listJoinRequests(activeVesselId!),
    enabled: !!activeVesselId && isCaptain,
  });

  // Leave Requests Query (Captain only)
  const { data: leaveRequests = [], isLoading: isLeaveRequestsLoading } = useQuery({
    queryKey: ["leave-requests", activeVesselId],
    queryFn: () => vesselApi.listLeaveRequests(activeVesselId!),
    enabled: !!activeVesselId && isCaptain,
  });

  const { data: inspectStats, isLoading: isInspectLoading } = useQuery({
    queryKey: ["inspect-performance", activeVesselId, inspectUserId],
    queryFn: async () => {
      const response = await apiClient.get("/dashboard/summary", {
        params: { vesselId: activeVesselId, targetUserId: inspectUserId },
      });
      return response.data?.result;
    },
    enabled: !!activeVesselId && !!inspectUserId,
  });

  // Realtime Mutations
  const requestLeaveMutation = useMutation({
    mutationFn: () => vesselApi.requestLeaveVessel(activeVesselId!),
    onSuccess: () => {
      toast.success("Leave VIP vessel request submitted. Awaiting Captain replacement.");
      queryClient.invalidateQueries({ queryKey: ["crew", activeVesselId] });
      queryClient.invalidateQueries({ queryKey: ["leave-requests", activeVesselId] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to submit leave request.");
    },
  });

  const rejectLeaveMutation = useMutation({
    mutationFn: (crewId: string) => vesselApi.rejectLeaveRequest(activeVesselId!, crewId),
    onSuccess: () => {
      toast.success("Leave request refused/rejected. Crew officer remains active.");
      queryClient.invalidateQueries({ queryKey: ["crew", activeVesselId] });
      queryClient.invalidateQueries({ queryKey: ["leave-requests", activeVesselId] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to refuse leave request.");
    },
  });

  const replaceCrewMutation = useMutation({
    mutationFn: ({ crewId, replacementUserId }: { crewId: string; replacementUserId: string }) =>
      vesselApi.replaceCrewMember(activeVesselId!, crewId, { replacementUserId }),
    onSuccess: () => {
      toast.success("Officer replaced successfully! Leaving request approved & replacement user onboarded.");
      setLeavingCrewForReplace(null);
      setSelectedReplacementUserId("");
      queryClient.invalidateQueries({ queryKey: ["crew", activeVesselId] });
      queryClient.invalidateQueries({ queryKey: ["crew-requests", activeVesselId] });
      queryClient.invalidateQueries({ queryKey: ["leave-requests", activeVesselId] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to replace officer.");
    },
  });

  const approveMutation = useMutation({
    mutationFn: ({ requestId, rank }: { requestId: string; rank: string }) =>
      crewApi.approveJoinRequest(activeVesselId!, requestId, rank),
    onSuccess: () => {
      toast.success("Crew member approved successfully");
      setApprovingReq(null);
      queryClient.invalidateQueries({ queryKey: ["crew", activeVesselId] });
      queryClient.invalidateQueries({ queryKey: ["crew-requests", activeVesselId] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to approve request");
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (requestId: string) =>
      crewApi.rejectJoinRequest(activeVesselId!, requestId),
    onSuccess: () => {
      toast.success("Join request rejected");
      queryClient.invalidateQueries({ queryKey: ["crew-requests", activeVesselId] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to reject request");
    },
  });

  const changeRankMutation = useMutation({
    mutationFn: ({ crewId, rank }: { crewId: string; rank: string }) =>
      crewApi.changeCrewRank(activeVesselId!, crewId, rank),
    onSuccess: () => {
      toast.success("Rank updated successfully");
      setIsRankModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["crew", activeVesselId] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to update rank");
    },
  });

  const handleOpenApproveModal = (req: any) => {
    setApprovingReq({ id: req.id || req._id, name: req.user?.fullName || req.user?.email || "Officer" });
    setInitialRank("Cadet");
  };

  const handleConfirmApprove = () => {
    if (!approvingReq) return;
    approveMutation.mutate({ requestId: approvingReq.id, rank: initialRank });
  };

  const handleOpenRankModal = (member: CrewMember) => {
    setSelectedCrew(member);
    setNewRank(member.rank);
    setIsRankModalOpen(true);
  };

  const handleSaveRank = () => {
    if (!selectedCrew) return;
    changeRankMutation.mutate({ crewId: selectedCrew.id || (selectedCrew as any)._id, rank: newRank });
  };

  if (!activeVesselId) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-zinc-200 font-sans max-w-2xl mx-auto my-12">
        <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider">No Active Vessel Selection</h3>
        <p className="text-xs text-zinc-500 mt-2">Select or configure an active vessel to view crew management options.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto p-4 md:p-8 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-black tracking-tight">Crew Management</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Realtime shipboard officer roster, rank assignments, and join/leave request authorizations.
          </p>
        </div>
        {isCaptain && (
          <div className="bg-[#f0f9ff] text-[#0055d4] border border-[#0055d4]/20 rounded-xl px-4 py-2 text-xs font-bold font-mono shadow-2xs flex items-center gap-2">
            <span className="text-[10px] text-zinc-400 uppercase tracking-wider">Invite Code:</span>
            <span>{activeVessel?.inviteCode || "N/A"}</span>
          </div>
        )}
      </div>

      {/* User Leave VIP Vessel Banner */}
      {!isCaptain && isVipVessel && (
        <div className="bg-purple-50 border border-purple-200 p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold text-lg shrink-0">
              🚪
            </div>
            <div>
              <h4 className="text-xs font-extrabold text-purple-950 uppercase tracking-wider">
                VIP Vessel Onboard Status
              </h4>
              <p className="text-xs text-purple-800 mt-0.5 font-medium">
                {hasRequestedLeave
                  ? "Leave Request Pending. Waiting for Captain to approve by replacing you with an applicant."
                  : "To activate another vessel, send a Leave Request to the Captain and await replacement."}
              </p>
            </div>
          </div>

          <button
            onClick={() => requestLeaveMutation.mutate()}
            disabled={requestLeaveMutation.isPending || hasRequestedLeave}
            className={`px-4 py-2.5 text-xs font-extrabold rounded-xl transition cursor-pointer shrink-0 ${
              hasRequestedLeave
                ? "bg-amber-100 text-amber-900 border border-amber-300 cursor-not-allowed"
                : "bg-purple-600 hover:bg-purple-700 text-white shadow-sm"
            }`}
          >
            {hasRequestedLeave
              ? "⏳ Leave Request Sent to Captain"
              : "🚪 Request to Leave VIP Vessel"}
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Dynamic Crew List */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between border-b border-zinc-150 pb-3 mb-4">
              <h3 className="text-sm font-bold text-black">Vessel Officers & Roster</h3>
              <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
                {crew.length} Approved Crew
              </span>
            </div>

            {isCrewLoading ? (
              <p className="text-xs text-zinc-400 italic py-4">Loading crew database from server...</p>
            ) : crew.length === 0 ? (
              <div className="p-6 text-center bg-zinc-50 rounded-xl border border-zinc-150">
                <p className="text-xs text-zinc-500 font-medium">No approved crew members on board yet.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {crew.map((member) => {
                  const mId = member.id || (member as any)._id;
                  const name =
                    member.user?.fullName ||
                    member.user?.email ||
                    (member.userId as any)?.fullName ||
                    (member.userId as any)?.email ||
                    "Officer Member";
                  const email =
                    member.user?.email ||
                    (member.userId as any)?.email ||
                    "";
                  const avatarUrl =
                    member.user?.avatarUrl ||
                    (member.userId as any)?.avatarUrl ||
                    null;
                  const initial = name[0]?.toUpperCase() || "O";
                  const mUserId = typeof member.userId === "object" ? (member.userId as any)._id : member.userId;
                  const memberLeaveRequested = (member as any).hasRequestedLeave || false;

                  return (
                    <div
                      key={mId}
                      className="flex items-center justify-between p-3.5 bg-zinc-50/70 border border-zinc-200 rounded-xl transition hover:bg-zinc-50"
                    >
                      <div className="flex items-center gap-3">
                        {avatarUrl ? (
                          <img
                            src={avatarUrl}
                            alt={name}
                            onClick={(e) => {
                              e.stopPropagation();
                              setPreviewImage(avatarUrl);
                            }}
                            title="Click to preview profile picture"
                            className="w-9 h-9 rounded-full object-cover border border-zinc-200 shrink-0 shadow-2xs cursor-pointer hover:scale-105 hover:opacity-90 transition"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-black text-xs border border-indigo-200 shrink-0">
                            {initial}
                          </div>
                        )}
                        <div className="flex flex-col gap-0.5">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-black">{name}</span>
                            <span className="text-[9px] font-extrabold uppercase bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded border border-indigo-200 font-mono">
                              {member.rank}
                            </span>
                            {memberLeaveRequested && (
                              <span className="text-[9px] font-extrabold uppercase bg-amber-100 text-amber-800 px-2 py-0.5 rounded border border-amber-300 animate-pulse font-mono">
                                ⚠️ Leave Requested
                              </span>
                            )}
                          </div>
                          {email && (
                            <span className="text-[10px] text-zinc-500 font-medium font-mono">
                              {email}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {isCaptain && mUserId !== user?.id && (
                          <>
                            <button
                              onClick={() => handleOpenRankModal(member)}
                              className="px-3 py-1.5 bg-white border border-zinc-200 text-[10px] font-bold text-zinc-700 hover:bg-zinc-100 hover:text-black rounded-lg transition cursor-pointer shadow-2xs"
                            >
                              Reassign Rank
                            </button>
                            <button
                              onClick={() => {
                                setLeavingCrewForReplace(member);
                                setSelectedReplacementUserId("");
                              }}
                              className="px-3 py-1.5 bg-purple-50 text-purple-700 border border-purple-200 text-[10px] font-bold hover:bg-purple-100 rounded-lg transition cursor-pointer shadow-2xs"
                            >
                              🔄 Replace Officer
                            </button>
                            <button
                              onClick={() => {
                                queryClient.invalidateQueries({
                                  queryKey: ["crew-member-details", activeVesselId, mId],
                                });
                                setActiveDrawerCrew(member);
                              }}
                              className="px-3 py-1.5 bg-indigo-50 text-indigo-700 border border-indigo-200 text-[10px] font-bold hover:bg-indigo-100 rounded-lg transition cursor-pointer"
                            >
                              Profile & Telemetry &rarr;
                            </button>
                          </>
                        )}
                        {mUserId === user?.id && (
                          <span className="text-[9px] uppercase font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                            Command Officer (You)
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right: Dual Request Management Center (Captain Only) */}
        {isCaptain && (
          <div className="flex flex-col gap-4">
            <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm flex flex-col gap-4">
              {/* Requests Section Tabs Header */}
              <div className="flex gap-2 border-b border-zinc-150 pb-2">
                <button
                  onClick={() => setRequestTab("join")}
                  className={`px-3 py-1.5 text-xs font-bold transition border-b-2 cursor-pointer ${
                    requestTab === "join"
                      ? "border-amber-600 text-amber-700"
                      : "border-transparent text-zinc-400 hover:text-black"
                  }`}
                >
                  Join Requests ({requests.length})
                </button>
                <button
                  onClick={() => setRequestTab("leave")}
                  className={`px-3 py-1.5 text-xs font-bold transition border-b-2 cursor-pointer relative ${
                    requestTab === "leave"
                      ? "border-purple-600 text-purple-700"
                      : "border-transparent text-zinc-400 hover:text-black"
                  }`}
                >
                  Leave Requests ({leaveRequests.length})
                  {leaveRequests.length > 0 && (
                    <span className="ml-1 px-1.5 py-0.5 text-[9px] bg-purple-100 text-purple-800 rounded-full font-mono">
                      {leaveRequests.length}
                    </span>
                  )}
                </button>
              </div>

              {/* 1. Pending Join Requests Tab */}
              {requestTab === "join" && (
                <div>
                  {isRequestsLoading ? (
                    <p className="text-xs text-zinc-400 italic py-4">Checking pending join requests...</p>
                  ) : requests.length === 0 ? (
                    <div className="p-6 text-center bg-zinc-50 rounded-xl border border-zinc-150">
                      <p className="text-xs text-zinc-500 font-medium">No pending join requests.</p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {requests.map((req) => {
                        const reqUser = req.user || (typeof (req as any).userId === "object" ? (req as any).userId : null);
                        const applicantName = reqUser?.fullName || reqUser?.email || "Applicant Officer";
                        const applicantEmail = reqUser?.email || "No email provided";
                        const requestedRank = req.requestedRank || req.rank || reqUser?.rank || "Officer Candidate";
                        const applicantAvatar = reqUser?.avatarUrl || null;
                        const initial = applicantName[0]?.toUpperCase() || "A";
                        const requestDate = req.createdAt ? new Date(req.createdAt).toLocaleDateString() : "Recent";

                        return (
                          <div
                            key={req.id || (req as any)._id}
                            className="p-4 bg-zinc-50/80 border border-zinc-200 rounded-2xl flex flex-col gap-3 shadow-2xs hover:bg-zinc-50 transition"
                          >
                            <div className="flex items-start gap-3">
                              {applicantAvatar ? (
                                <img
                                  src={applicantAvatar}
                                  alt={applicantName}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setPreviewImage(applicantAvatar);
                                  }}
                                  title="Click to preview profile picture"
                                  className="w-10 h-10 rounded-full object-cover border border-zinc-200 shrink-0 shadow-2xs cursor-pointer hover:scale-105 hover:opacity-90 transition"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-black text-xs border border-amber-300 shadow-2xs shrink-0">
                                  {initial}
                                </div>
                              )}
                              <div className="flex flex-col gap-0.5 overflow-hidden">
                                <div className="flex items-center justify-between gap-2">
                                  <span className="text-xs font-extrabold text-black truncate">{applicantName}</span>
                                  <span className="text-[9px] font-mono text-zinc-400 shrink-0">{requestDate}</span>
                                </div>
                                <span className="text-[11px] text-zinc-500 font-medium font-mono truncate">
                                  {applicantEmail}
                                </span>
                                <div className="flex items-center gap-1.5 mt-1">
                                  <span className="text-[9px] font-extrabold text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded border border-amber-200 uppercase font-mono">
                                    Requested: {requestedRank}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 pt-1 border-t border-zinc-150">
                              <button
                                onClick={() => handleOpenApproveModal(req)}
                                className="flex-1 px-3 py-2 bg-[#0055d4] hover:bg-[#003fa3] text-[10px] font-bold text-white rounded-xl transition cursor-pointer text-center shadow-2xs"
                              >
                                Authorize & Assign Rank &rarr;
                              </button>
                              <button
                                onClick={() => rejectMutation.mutate(req.id || (req as any)._id)}
                                disabled={rejectMutation.isPending}
                                className="px-3 py-2 bg-white border border-red-200 text-[10px] font-bold text-red-600 hover:bg-red-50 rounded-xl transition cursor-pointer"
                              >
                                Refuse Join
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* 2. Pending Leave Requests Tab */}
              {requestTab === "leave" && (
                <div>
                  {isLeaveRequestsLoading ? (
                    <p className="text-xs text-zinc-400 italic py-4">Checking pending leave requests...</p>
                  ) : leaveRequests.length === 0 ? (
                    <div className="p-6 text-center bg-zinc-50 rounded-xl border border-zinc-150">
                      <p className="text-xs text-zinc-500 font-medium">No officers currently requesting to leave.</p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {leaveRequests.map((lReq: any) => {
                        const lUser = lReq.userId && typeof lReq.userId === "object" ? lReq.userId : null;
                        const lName = lUser?.fullName || lUser?.email || "Officer Candidate";
                        const lEmail = lUser?.email || "";
                        const lRank = lReq.rank || lUser?.rank || "Officer";
                        const lAvatar = lUser?.avatarUrl || null;
                        const initial = lName[0]?.toUpperCase() || "O";
                        const cId = lReq._id || lReq.id;

                        return (
                          <div
                            key={cId}
                            className="p-4 bg-purple-50/50 border border-purple-200 rounded-2xl flex flex-col gap-3 shadow-2xs hover:bg-purple-50/80 transition"
                          >
                            <div className="flex items-start gap-3">
                              {lAvatar ? (
                                <img
                                  src={lAvatar}
                                  alt={lName}
                                  className="w-10 h-10 rounded-full object-cover border border-zinc-200 shrink-0 shadow-2xs"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-800 flex items-center justify-center font-black text-xs border border-purple-300 shrink-0">
                                  {initial}
                                </div>
                              )}
                              <div className="flex flex-col gap-0.5 overflow-hidden">
                                <div className="flex items-center justify-between gap-2">
                                  <span className="text-xs font-extrabold text-black truncate">{lName}</span>
                                  <span className="text-[9px] font-extrabold text-amber-700 bg-amber-100 px-2 py-0.5 rounded border border-amber-200 uppercase font-mono">
                                    Leave Requested
                                  </span>
                                </div>
                                <span className="text-[11px] text-zinc-500 font-mono truncate">{lEmail}</span>
                                <span className="text-[10px] text-purple-900 font-bold mt-0.5">
                                  Current Rank: <strong>{lRank}</strong>
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 pt-1 border-t border-purple-200/80">
                              <button
                                onClick={() => {
                                  setLeavingCrewForReplace(lReq);
                                  setSelectedReplacementUserId("");
                                }}
                                className="flex-1 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-[10px] font-bold text-white rounded-xl transition cursor-pointer text-center shadow-2xs"
                              >
                                🔄 Replace & Approve Leave &rarr;
                              </button>
                              <button
                                onClick={() => rejectLeaveMutation.mutate(cId)}
                                disabled={rejectLeaveMutation.isPending}
                                className="px-3 py-2 bg-white border border-red-200 text-[10px] font-bold text-red-600 hover:bg-red-50 rounded-xl transition cursor-pointer"
                              >
                                Refuse Leave
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Replace Officer Modal (Captain approves Leave Request by picking Join Request candidate) */}
      {leavingCrewForReplace && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white border border-zinc-200 rounded-3xl w-full max-w-lg p-6 shadow-2xl flex flex-col gap-5">
            <div className="flex items-center justify-between border-b border-zinc-150 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 border border-purple-200 flex items-center justify-center font-bold text-xl">
                  🔄
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-black">
                    Replace Crew Member & Approve Leave
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Leaving Officer: <strong>{leavingCrewForReplace.user?.fullName || leavingCrewForReplace.userId?.fullName || "Officer"}</strong> ({leavingCrewForReplace.rank})
                  </p>
                </div>
              </div>

              <button
                onClick={() => setLeavingCrewForReplace(null)}
                className="p-2 text-zinc-400 hover:text-black rounded-xl hover:bg-zinc-100 transition cursor-pointer text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-zinc-600 bg-purple-50/70 border border-purple-200 p-3 rounded-2xl leading-relaxed">
              Selecting a replacement candidate will <strong>approve the replacement officer's join request</strong> and <strong>approve the leaving officer's leave request</strong> simultaneously. All log history of the leaving officer remains preserved intact.
            </p>

            <div className="flex flex-col gap-3">
              <label className="text-[10px] font-bold text-zinc-400 uppercase font-mono">
                Select Replacement Join Request Candidate ({requests.length} Applicants Waiting)
              </label>

              {requests.length === 0 ? (
                <div className="p-4 text-center bg-amber-50 rounded-2xl border border-amber-200">
                  <p className="text-xs text-amber-900 font-bold">No pending join requests found.</p>
                  <p className="text-[11px] text-amber-700 mt-1">
                    Captain must wait until another crew member sends a join request to replace the leaving officer.
                  </p>
                </div>
              ) : (
                <div className="max-h-56 overflow-y-auto flex flex-col gap-2 border border-zinc-200 rounded-2xl p-2 bg-zinc-50/50">
                  {requests.map((r) => {
                    const rUser = r.user || (typeof (r as any).userId === "object" ? (r as any).userId : null);
                    const rUserId = rUser?._id || rUser?.id || (typeof r.userId === "string" ? r.userId : "");
                    const isSelected = selectedReplacementUserId === rUserId;

                    return (
                      <div
                        key={r.id || (r as any)._id}
                        onClick={() => setSelectedReplacementUserId(rUserId)}
                        className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                          isSelected
                            ? "bg-purple-50 border-purple-500 shadow-2xs"
                            : "bg-white border-zinc-200 hover:bg-zinc-50"
                        }`}
                      >
                        <div className="flex flex-col">
                          <span className="text-xs font-extrabold text-black">
                            {rUser?.fullName || rUser?.email || "Candidate Officer"}
                          </span>
                          <span className="text-[10px] text-zinc-400 font-mono">{rUser?.email}</span>
                        </div>
                        {isSelected && (
                          <span className="text-[10px] font-extrabold text-purple-700 bg-purple-100 px-2 py-0.5 rounded border border-purple-200">
                            ✓ Replacement Candidate Selected
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 border-t border-zinc-150 pt-3">
              <button
                onClick={() =>
                  replaceCrewMutation.mutate({
                    crewId: leavingCrewForReplace.id || (leavingCrewForReplace as any)._id,
                    replacementUserId: selectedReplacementUserId,
                  })
                }
                disabled={replaceCrewMutation.isPending || !selectedReplacementUserId}
                className="flex-1 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-xs font-extrabold text-white rounded-xl transition cursor-pointer text-center shadow-md"
              >
                {replaceCrewMutation.isPending ? "Approving Replacement..." : "Confirm & Approve Replacement"}
              </button>
              <button
                onClick={() => setLeavingCrewForReplace(null)}
                className="px-4 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-xs font-bold text-black rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Authorize & Assign Rank Interactive Modal (Direct Join Request Approval) */}
      {approvingReq && (
        <div className="fixed inset-0 bg-black/45 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white border border-zinc-200 rounded-2xl w-full max-w-sm p-6 shadow-2xl flex flex-col gap-4">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded border border-sky-200">
                Join Authorization
              </span>
              <h3 className="text-base font-extrabold text-black mt-1">
                Authorize {approvingReq.name}
              </h3>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase font-extrabold text-zinc-500 tracking-wider">
                Assign Initial Shipboard Rank
              </label>
              <select
                value={initialRank}
                onChange={(e) => setInitialRank(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-200 p-2.5 text-xs font-semibold rounded-xl text-black cursor-pointer"
              >
                {MARITIME_RANKS.map((rank) => (
                  <option key={rank} value={rank}>
                    {rank}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-3 border-t border-zinc-150 pt-3.5">
              <button
                onClick={handleConfirmApprove}
                disabled={approveMutation.isPending}
                className="flex-1 py-2.5 bg-[#0055d4] hover:bg-[#003fa3] text-xs font-bold text-white rounded-xl transition cursor-pointer"
              >
                {approveMutation.isPending ? "Authorizing..." : "Confirm & Authorize"}
              </button>
              <button
                onClick={() => setApprovingReq(null)}
                className="px-4 py-2.5 bg-white border border-zinc-200 text-xs font-bold text-zinc-600 hover:bg-zinc-100 rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rank Reassignment Modal */}
      {isRankModalOpen && (
        <div className="fixed inset-0 bg-black/45 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white border border-zinc-200 rounded-2xl w-full max-w-sm p-6 shadow-2xl flex flex-col gap-4">
            <h3 className="text-sm font-bold text-black border-b border-zinc-150 pb-2.5">
              Reassign Officer Rank
            </h3>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase font-extrabold text-zinc-500 tracking-wider">
                Select Maritime Rank
              </label>
              <select
                value={newRank}
                onChange={(e) => setNewRank(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-200 p-2.5 text-xs font-semibold rounded-xl text-black cursor-pointer"
              >
                {MARITIME_RANKS.map((rank) => (
                  <option key={rank} value={rank}>
                    {rank}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-3 border-t border-zinc-150 pt-3.5">
              <button
                onClick={handleSaveRank}
                disabled={changeRankMutation.isPending}
                className="flex-1 py-2.5 bg-[#0055d4] hover:bg-[#003fa3] text-xs font-bold text-white rounded-xl transition cursor-pointer"
              >
                {changeRankMutation.isPending ? "Updating..." : "Apply Change"}
              </button>
              <button
                onClick={() => setIsRankModalOpen(false)}
                className="px-4 py-2.5 bg-white border border-zinc-200 text-xs font-bold text-zinc-600 hover:bg-zinc-100 rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Inspector Cockpit Drawer/Modal */}
      {isInspectOpen && (
        <div className="fixed inset-0 bg-black/45 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-zinc-200 rounded-2xl w-full max-w-md p-6 shadow-2xl flex flex-col gap-4 font-sans">
            <h3 className="text-sm font-bold text-black border-b border-zinc-150 pb-2.5 flex items-center justify-between">
              <span>Crew Member Operational Telemetry</span>
              <button
                onClick={() => {
                  setIsInspectOpen(false);
                  setInspectUserId(null);
                }}
                className="text-xs text-zinc-400 hover:text-black font-bold cursor-pointer"
              >
                ✕ Close
              </button>
            </h3>
            {isInspectLoading ? (
              <p className="text-xs text-zinc-400 italic py-4">Fetching operational telemetry records...</p>
            ) : inspectStats ? (
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-zinc-50 border border-zinc-200 p-4 rounded-xl flex flex-col gap-1">
                    <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Completion Rate</span>
                    <span className="text-2xl font-extrabold text-black">
                      {inspectStats.completionRate || 0}%
                    </span>
                  </div>
                  <div className="bg-zinc-50 border border-zinc-200 p-4 rounded-xl flex flex-col gap-1">
                    <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Open Issues</span>
                    <span className="text-2xl font-extrabold text-amber-600">
                      {inspectStats.reportedIssues || 0}
                    </span>
                  </div>
                </div>

                <div className="bg-zinc-50 border border-zinc-200 p-4 rounded-xl flex flex-col gap-2">
                  <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Cycle Progress Stats</span>
                  <div className="flex justify-between text-xs text-black border-b border-zinc-100 pb-1.5">
                    <span className="font-semibold">Completed Checklist Items:</span>
                    <span className="font-bold">{inspectStats.completedTasks || 0}</span>
                  </div>
                  <div className="flex justify-between text-xs text-black border-b border-zinc-100 pb-1.5">
                    <span className="font-semibold">Pending Checklist Items:</span>
                    <span className="font-bold text-zinc-500">{inspectStats.pendingTasks || 0}</span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-zinc-450 italic py-4">Failed to fetch performance statistics.</p>
            )}
          </div>
        </div>
      )}

      {/* Image Preview Lightbox Modal */}
      <ImagePreviewModal
        isOpen={!!previewImage}
        src={previewImage}
        onClose={() => setPreviewImage(null)}
      />

      {/* Crew Detail Drawer */}
      <CrewDetailDrawer
        member={activeDrawerCrew}
        onClose={() => setActiveDrawerCrew(null)}
        isCaptain={isCaptain}
        initialTab={drawerInitialTab}
        onReassignRank={(crewId, rank) => {
          changeRankMutation.mutate({ crewId, rank });
          setActiveDrawerCrew(null);
        }}
      />
    </div>
  );
};

export default CrewPage;
