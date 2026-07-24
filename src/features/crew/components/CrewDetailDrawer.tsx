import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { CrewMember } from "../api/crew.api";
import { crewApi } from "../api/crew.api";
import { useActiveVessel } from "../../../shared/hooks/useActiveVessel";
import { toast } from "react-hot-toast";
import { ImagePreviewModal } from "../../../shared/components/ImagePreviewModal";

interface CrewDetailDrawerProps {
  member: CrewMember | null;
  onClose: () => void;
  onReassignRank: (crewId: string, newRank: string) => void;
  isCaptain?: boolean;
  initialTab?: "completed" | "pending" | "issues";
}

export const CrewDetailDrawer: React.FC<CrewDetailDrawerProps> = ({
  member,
  onClose,
  onReassignRank,
  isCaptain = false,
  initialTab = "completed",
}) => {
  const { activeVesselId } = useActiveVessel();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<"completed" | "pending" | "issues">(initialTab);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab, member]);

  const crewId = member?.id || (member as any)?._id;

  // Single dedicated real-time backend query fetching member details, completed tasks, pending tasks, and issues
  const { data: detailsData, isLoading } = useQuery({
    queryKey: ["crew-member-details", activeVesselId, crewId],
    queryFn: () => crewApi.getCrewMemberDetails(activeVesselId!, crewId!),
    enabled: !!activeVesselId && !!crewId,
    staleTime: 0,
    refetchOnMount: "always",
  });

  const memberInfo = detailsData?.member || member;
  const rawUser = memberInfo?.user || (typeof (memberInfo as any)?.userId === "object" ? (memberInfo as any)?.userId : null);

  const memberName =
    rawUser?.fullName ||
    rawUser?.email ||
    (typeof member?.userId === "object" ? (member.userId as any)?.fullName || (member.userId as any)?.email : null) ||
    "Crew Officer";

  const memberEmail =
    rawUser?.email ||
    (typeof member?.userId === "object" ? (member.userId as any)?.email : null) ||
    "No email registered";

  const avatarUrl =
    rawUser?.avatarUrl ||
    (typeof member?.userId === "object" ? (member.userId as any)?.avatarUrl : null) ||
    null;

  const completedTasks = detailsData?.completedTasks || [];
  const pendingTasks = detailsData?.pendingTasks || [];
  const rawIssues = detailsData?.issues || [];
  const issuesData = rawIssues.filter(
    (issue) =>
      String(issue.status).toUpperCase() !== "RESOLVED" &&
      String(issue.status).toUpperCase() !== "CLOSED"
  );
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);

  // Group tasks by category/taskGroup
  const dailyCompleted = completedTasks.filter((t) => (t.taskGroup || "").toLowerCase() === "daily");
  const weeklyCompleted = completedTasks.filter((t) => (t.taskGroup || "").toLowerCase() === "weekly");
  const monthlyCompleted = completedTasks.filter((t) => (t.taskGroup || "").toLowerCase() === "monthly");
  const signonCompleted = completedTasks.filter((t) => (t.taskGroup || "").toLowerCase() === "signon" || (t.taskGroup || "").toLowerCase() === "sign-on");

  const dailyPending = pendingTasks.filter((t) => (t.taskGroup || "").toLowerCase() === "daily");
  const weeklyPending = pendingTasks.filter((t) => (t.taskGroup || "").toLowerCase() === "weekly");
  const monthlyPending = pendingTasks.filter((t) => (t.taskGroup || "").toLowerCase() === "monthly");
  const signonPending = pendingTasks.filter((t) => (t.taskGroup || "").toLowerCase() === "signon" || (t.taskGroup || "").toLowerCase() === "sign-on");

  // Offboard Crew Member Mutation
  const removeMutation = useMutation({
    mutationFn: () => crewApi.removeCrewMember(activeVesselId!, crewId!),
    onSuccess: () => {
      toast.success(`Crew member "${memberName}" offboarded successfully. Historical logs remain preserved.`);
      queryClient.invalidateQueries({ queryKey: ["crew", activeVesselId] });
      onClose();
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to offboard crew member");
    },
  });

  const handleRemoveCrew = () => {
    if (!activeVesselId || !crewId) return;
    if (
      confirm(
        `Are you sure you want to offboard "${memberName}" from this vessel?\n\nThe user's membership will be set to INACTIVE on this vessel, but all their completed tasks, telemetry, and reported issues will be safely preserved for historical audit logbooks.`
      )
    ) {
      removeMutation.mutate();
    }
  };

  if (!member) return null;

  return (
    <div className="fixed inset-0 bg-black/55 backdrop-blur-xs flex justify-end z-50 animate-fade-in">
      <div className="bg-white border-l border-zinc-200 w-full max-w-lg h-full p-6 flex flex-col justify-between shadow-2xl overflow-y-auto font-sans">
        <div className="flex flex-col gap-6">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-zinc-150 pb-4">
            <div className="flex items-center gap-3">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={memberName}
                  onClick={() => setPreviewImageUrl(avatarUrl)}
                  title="Click to preview profile picture"
                  className="w-12 h-12 rounded-full object-cover border border-zinc-200 shrink-0 shadow-2xs cursor-pointer hover:scale-105 hover:opacity-90 transition"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-black text-sm border border-indigo-200 shrink-0">
                  {memberName[0]?.toUpperCase() || "O"}
                </div>
              )}
              <div className="flex flex-col">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded border border-indigo-200 w-fit">
                  Crew Member Detail Drawer
                </span>
                <h3 className="text-xl font-extrabold text-black mt-1">{memberName}</h3>
                <p className="text-xs text-zinc-400 font-mono mt-0.5">{memberEmail}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-zinc-400 hover:text-black rounded-xl hover:bg-zinc-100 transition cursor-pointer text-sm font-bold"
            >
              ✕
            </button>
          </div>

          {/* Member Overview Banner */}
          <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                Rank & Assignment
              </span>
              <span className="text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-300">
                {memberInfo?.status || "APPROVED"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-base font-extrabold text-black">{memberInfo?.rank || member.rank}</span>
              {isCaptain && (
                <select
                  value={memberInfo?.rank || member.rank}
                  onChange={(e) => onReassignRank(crewId, e.target.value)}
                  className="bg-white border border-zinc-200 p-2 text-xs font-bold rounded-xl text-black cursor-pointer shadow-2xs"
                >
                  <option value="Captain">Captain</option>
                  <option value="Chief Officer">Chief Officer</option>
                  <option value="Second Officer">Second Officer</option>
                  <option value="Third Officer">Third Officer</option>
                  <option value="Bosun">Bosun</option>
                  <option value="Able Seaman">Able Seaman</option>
                  <option value="Ordinary Seaman">Ordinary Seaman</option>
                  <option value="Cadet">Cadet</option>
                </select>
              )}
            </div>
          </div>

          {/* Category Progress Summary */}
          <div className="grid grid-cols-4 gap-2 bg-zinc-50 border border-zinc-200 rounded-xl p-3 text-center">
            <div className="flex flex-col">
              <span className="text-[9px] font-extrabold text-zinc-400 uppercase">Daily</span>
              <span className="text-xs font-black text-indigo-600">{dailyCompleted.length}/{dailyCompleted.length + dailyPending.length}</span>
            </div>
            <div className="flex flex-col border-l border-zinc-200">
              <span className="text-[9px] font-extrabold text-zinc-400 uppercase">Weekly</span>
              <span className="text-xs font-black text-indigo-600">{weeklyCompleted.length}/{weeklyCompleted.length + weeklyPending.length}</span>
            </div>
            <div className="flex flex-col border-l border-zinc-200">
              <span className="text-[9px] font-extrabold text-zinc-400 uppercase">Monthly</span>
              <span className="text-xs font-black text-indigo-600">{monthlyCompleted.length}/{monthlyCompleted.length + monthlyPending.length}</span>
            </div>
            <div className="flex flex-col border-l border-zinc-200">
              <span className="text-[9px] font-extrabold text-zinc-400 uppercase">Sign-On</span>
              <span className="text-xs font-black text-indigo-600">{signonCompleted.length}/{signonCompleted.length + signonPending.length}</span>
            </div>
          </div>

          {/* Detailed Task & Issue Telemetry Tabs */}
          <div className="flex flex-col gap-3">
            <div className="flex border-b border-zinc-200 gap-2">
              <button
                onClick={() => setActiveTab("completed")}
                className={`pb-2 text-xs font-bold border-b-2 transition cursor-pointer ${
                  activeTab === "completed"
                    ? "border-emerald-600 text-emerald-600 font-extrabold"
                    : "border-transparent text-zinc-400 hover:text-black"
                }`}
              >
                Completed Tasks ({completedTasks.length})
              </button>
              <button
                onClick={() => setActiveTab("pending")}
                className={`pb-2 text-xs font-bold border-b-2 transition cursor-pointer ${
                  activeTab === "pending"
                    ? "border-amber-600 text-amber-600 font-extrabold"
                    : "border-transparent text-zinc-400 hover:text-black"
                }`}
              >
                Pending Tasks ({pendingTasks.length})
              </button>
              <button
                onClick={() => setActiveTab("issues")}
                className={`pb-2 text-xs font-bold border-b-2 transition cursor-pointer ${
                  activeTab === "issues"
                    ? "border-red-600 text-red-600 font-extrabold"
                    : "border-transparent text-zinc-400 hover:text-black"
                }`}
              >
                Issues ({issuesData.length})
              </button>
            </div>

            {/* Tab Contents */}
            <div className="max-h-72 overflow-y-auto flex flex-col gap-2 pt-1">
              {isLoading ? (
                <p className="text-xs text-zinc-400 italic py-6 text-center">
                  Loading operational logs from vessel database...
                </p>
              ) : (
                <>
                  {/* Completed Tasks List */}
                  {activeTab === "completed" && (
                    completedTasks.length === 0 ? (
                      <p className="text-xs text-zinc-400 italic py-6 text-center bg-zinc-50 rounded-xl border border-zinc-150">
                        No completed tasks logged yet.
                      </p>
                    ) : (
                      completedTasks.map((t, idx) => (
                        <div
                          key={t.id || idx}
                          className="p-3 bg-emerald-50/50 border border-emerald-200 rounded-xl flex items-center justify-between"
                        >
                          <div className="flex flex-col gap-0.5">
                            <span className="text-xs font-bold text-black">{t.title}</span>
                            <span className="text-[10px] text-zinc-500 font-mono">
                              Group: {t.taskGroup} &bull; {t.completedAt ? new Date(t.completedAt).toLocaleString() : "Completed"}
                            </span>
                          </div>
                          <span className="text-[10px] font-extrabold text-emerald-700 bg-white px-2 py-0.5 rounded border border-emerald-300">
                            ✓ Done
                          </span>
                        </div>
                      ))
                    )
                  )}

                  {/* Pending Tasks List */}
                  {activeTab === "pending" && (
                    pendingTasks.length === 0 ? (
                      <p className="text-xs text-zinc-400 italic py-6 text-center bg-zinc-50 rounded-xl border border-zinc-150">
                        No pending tasks for this officer.
                      </p>
                    ) : (
                      pendingTasks.map((t, idx) => (
                        <div
                          key={t.id || idx}
                          className="p-3 bg-amber-50/50 border border-amber-200 rounded-xl flex items-center justify-between"
                        >
                          <div className="flex flex-col gap-0.5">
                            <span className="text-xs font-bold text-black">{t.title}</span>
                            <span className="text-[10px] text-zinc-500 font-mono">
                              Group: {t.taskGroup} &bull; Status: {t.status}
                            </span>
                          </div>
                          <span className="text-[10px] font-extrabold text-amber-700 bg-white px-2 py-0.5 rounded border border-amber-300">
                            ⏳ Pending
                          </span>
                        </div>
                      ))
                    )
                  )}

                  {/* Reported Issues List */}
                  {activeTab === "issues" && (
                    issuesData.length === 0 ? (
                      <p className="text-xs text-zinc-400 italic py-6 text-center bg-zinc-50 rounded-xl border border-zinc-150">
                        No reported issues logged for this officer.
                      </p>
                    ) : (
                      issuesData.map((issue, idx) => {
                        const imgUrl = issue.imageUrl || (issue as any).imagePath || null;
                        return (
                          <div
                            key={issue.id || idx}
                            className="p-3 bg-red-50/40 border border-red-200 rounded-xl flex flex-col gap-2"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-extrabold text-black">{issue.title}</span>
                              <span className="text-[9px] font-extrabold uppercase bg-red-100 text-red-700 px-2 py-0.5 rounded border border-red-300">
                                {issue.severity || "Critical"}
                              </span>
                            </div>
                            <p className="text-[11px] text-zinc-500 line-clamp-2">{issue.description}</p>
                            
                            {imgUrl && (
                              <div className="flex items-center gap-2 mt-1">
                                <img
                                  src={imgUrl}
                                  alt="Issue evidence"
                                  onClick={() => setPreviewImageUrl(imgUrl)}
                                  className="w-14 h-14 object-cover rounded-lg border border-red-200 cursor-pointer hover:opacity-90 transition shadow-2xs"
                                />
                                <button
                                  type="button"
                                  onClick={() => setPreviewImageUrl(imgUrl)}
                                  className="text-[10px] text-indigo-600 font-bold hover:underline cursor-pointer"
                                >
                                  📷 View Evidence Image &rarr;
                                </button>
                              </div>
                            )}

                            <span className="text-[9px] text-zinc-400 font-mono mt-0.5">
                              Status: {issue.status || "OPEN"} &bull; Logged: {new Date(issue.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        );
                      })
                    )
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Image Preview Lightbox Modal */}
        <ImagePreviewModal
          isOpen={!!previewImageUrl}
          src={previewImageUrl}
          onClose={() => setPreviewImageUrl(null)}
        />

        {/* Footer with Offboard Action Button */}
        <div className="border-t border-zinc-150 pt-4 flex flex-col gap-2">
          {isCaptain && (
            <button
              onClick={handleRemoveCrew}
              disabled={removeMutation.isPending}
              className="w-full py-2.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-extrabold rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>🗑️</span>
              <span>{removeMutation.isPending ? "Offboarding..." : "Offboard / Remove Crew Member"}</span>
            </button>
          )}

          <button
            onClick={onClose}
            className="w-full py-2.5 bg-zinc-100 hover:bg-zinc-200 text-xs font-bold text-black rounded-xl transition cursor-pointer"
          >
            Close Profile Drawer
          </button>
        </div>
      </div>
    </div>
  );
};

export default CrewDetailDrawer;
