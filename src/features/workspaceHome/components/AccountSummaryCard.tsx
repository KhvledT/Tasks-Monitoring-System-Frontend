import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import { RoleBadge } from "./RoleBadge";
import { WorkspaceBadge } from "./WorkspaceBadge";
import { ROUTES } from "../../../constants/routes";
import { ImagePreviewModal } from "../../../shared/components/ImagePreviewModal";
import { vesselApi } from "../../vessel/api/vessel.api";
import { toast } from "react-hot-toast";
import { useSocket } from "../../../providers/SocketProvider";
import { useQueryClient } from "@tanstack/react-query";

interface AccountSummaryCardProps {
  user: any;
  activeVessel: any;
}

export const AccountSummaryCard: React.FC<AccountSummaryCardProps> = ({
  user,
  activeVessel,
}) => {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isLeaving, setIsLeaving] = useState(false);
  const { socket } = useSocket();
  const queryClient = useQueryClient();

  const vesselId = (activeVessel as any)?._id || activeVessel?.id;

  const [hasRequestedLeave, setHasRequestedLeave] = useState<boolean>(() => {
    if (activeVessel?.hasRequestedLeave) return true;
    if (vesselId && localStorage.getItem(`mtms_pending_leave_${vesselId}`)) return true;
    return false;
  });

  // Sync leave state when activeVessel changes
  useEffect(() => {
    if (activeVessel?.hasRequestedLeave) {
      setHasRequestedLeave(true);
    } else if (vesselId && localStorage.getItem(`mtms_pending_leave_${vesselId}`)) {
      setHasRequestedLeave(true);
    } else {
      setHasRequestedLeave(false);
    }
  }, [activeVessel, vesselId]);

  // Real-time Socket.io listener for Captain's leave approval or refusal
  useEffect(() => {
    if (!socket) return;

    const handleLeaveApproved = (data: any) => {
      if (!vesselId || data?.vesselId === vesselId) {
        setHasRequestedLeave(false);
        try {
          if (vesselId) localStorage.removeItem(`mtms_pending_leave_${vesselId}`);
          localStorage.removeItem("mtms_has_pending_leave");
        } catch (e) {}
        queryClient.invalidateQueries({ queryKey: ["vessels"] });
        queryClient.invalidateQueries({ queryKey: ["user-vessels"] });
      }
    };

    const handleLeaveRejected = (data: any) => {
      if (!vesselId || data?.vesselId === vesselId) {
        setHasRequestedLeave(false);
        try {
          if (vesselId) localStorage.removeItem(`mtms_pending_leave_${vesselId}`);
          localStorage.removeItem("mtms_has_pending_leave");
        } catch (e) {}
        queryClient.invalidateQueries({ queryKey: ["vessels"] });
        queryClient.invalidateQueries({ queryKey: ["user-vessels"] });
      }
    };

    socket.on("crew:leave_approved", handleLeaveApproved);
    socket.on("crew:leave_rejected", handleLeaveRejected);

    return () => {
      socket.off("crew:leave_approved", handleLeaveApproved);
      socket.off("crew:leave_rejected", handleLeaveRejected);
    };
  }, [socket, vesselId, queryClient]);

  const avatar =
    user?.avatarUrl ||
    user?.profileImage ||
    user?.imageAvatar ||
    user?.userAvatar ||
    user?.avatar ||
    null;

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  const handleRequestLeave = async () => {
    if (!vesselId) return;

    setIsLeaving(true);
    try {
      await vesselApi.requestLeaveVessel(vesselId);
      setHasRequestedLeave(true);
      toast.success("Leave vessel request submitted! Awaiting Captain replacement.");
      queryClient.invalidateQueries({ queryKey: ["vessels"] });
      queryClient.invalidateQueries({ queryKey: ["user-vessels"] });
    } catch (e: any) {
      toast.error(e.response?.data?.message || "Failed to submit leave request.");
    } finally {
      setIsLeaving(false);
    }
  };

  const isVipVessel = activeVessel?.vesselMode === "VIP";
  const isRegularUser = user?.role === "USER";

  return (
    <div className="bg-white border border-zinc-200 rounded-3xl p-6 shadow-sm flex flex-col gap-6 font-sans justify-between">
      {/* Top Identity Block */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-150 pb-5">
        <div className="flex items-center gap-4">
          {avatar ? (
            <img
              src={avatar}
              alt={user?.fullName || "User"}
              onClick={() => setPreviewImage(avatar)}
              className="w-14 h-14 rounded-2xl object-cover border border-zinc-200 shadow-2xs shrink-0 cursor-pointer hover:opacity-90 transition"
              title="Click to preview profile picture"
            />
          ) : (
            <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-primary/30 flex items-center justify-center font-extrabold text-base text-primary shadow-inner shrink-0">
              {getInitials(user?.fullName)}
            </div>
          )}
          <div className="flex flex-col gap-0.5">
            <h2 className="text-xl font-extrabold text-black tracking-tight">
              {user?.fullName || "Authenticated User"}
            </h2>
            <p className="text-xs text-zinc-400 font-mono font-medium">
              {user?.email}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <RoleBadge role={user?.role} />
            </div>
          </div>
        </div>

        <WorkspaceBadge role={user?.role} />
      </div>

      {/* Vessel Workspace Status Block */}
      <div className="flex flex-col gap-3">
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-400">
          Current Vessel Context
        </span>

        {activeVessel ? (
          <div className="p-4 bg-zinc-50/80 border border-zinc-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 border border-sky-200 flex items-center justify-center font-bold text-lg">
                🚢
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-extrabold text-black">
                    {activeVessel.name}
                  </span>
                  <span className="text-[10px] font-extrabold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">
                    {activeVessel.vesselStatus ||
                      (activeVessel.isActive ? "Active" : "Operational")}
                  </span>
                </div>
                <span className="text-xs text-zinc-500 font-medium">
                  Type: {activeVessel.type || "Standard"} &bull; Rank:{" "}
                  {user?.rank || "Officer"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {isVipVessel && isRegularUser && (
                <button
                  type="button"
                  onClick={handleRequestLeave}
                  disabled={isLeaving || hasRequestedLeave}
                  className={`px-3 py-2 text-xs font-extrabold rounded-xl transition cursor-pointer ${
                    hasRequestedLeave
                      ? "bg-amber-100 text-amber-900 border border-amber-300 cursor-not-allowed"
                      : "bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200"
                  }`}
                >
                  {hasRequestedLeave ? "⏳ Leave Requested" : "🚪 Leave Vessel"}
                </button>
              )}

              <Link
                to={ROUTES.SELECT_VESSEL}
                className="px-3.5 py-2 bg-white border border-zinc-250 text-zinc-700 hover:text-black hover:bg-zinc-100 text-xs font-bold rounded-xl transition cursor-pointer shrink-0 shadow-2xs"
              >
                Switch Vessel &rarr;
              </Link>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 border border-amber-250 flex items-center justify-center font-bold text-lg">
                ⚠️
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-extrabold text-amber-950">
                  No Active Vessel Context
                </span>
                <span className="text-[11px] text-amber-800 font-medium">
                  {user?.role === "SUPER_ADMIN"
                    ? "Global platform administration view active. Selecting a vessel is optional."
                    : "Select, provision, or apply to join a vessel to unlock vessel-bound features."}
                </span>
              </div>
            </div>

            <Link
              to={ROUTES.SELECT_VESSEL}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-extrabold rounded-xl transition shadow-2xs shrink-0 cursor-pointer"
            >
              Select or Join Vessel &rarr;
            </Link>
          </div>
        )}
      </div>

      {/* Image Preview Lightbox Modal */}
      <ImagePreviewModal
        isOpen={!!previewImage}
        src={previewImage}
        onClose={() => setPreviewImage(null)}
      />
    </div>
  );
};

export default AccountSummaryCard;
