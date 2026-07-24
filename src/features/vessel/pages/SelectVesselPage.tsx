import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { QRCodeSVG } from "qrcode.react";
import { ROUTES } from "../../../constants/routes";
import { useVessels } from "../hooks/useVessels";
import { useCreateVessel } from "../hooks/useCreateVessel";
import { useActivateVessel } from "../hooks/useActivateVessel";
import { useUpdateVessel } from "../hooks/useUpdateVessel";
import { useDeleteVessel } from "../hooks/useDeleteVessel";
import { useAuth } from "../../../shared/hooks/useAuth";
import { useActiveVessel } from "../../../shared/hooks/useActiveVessel";
import { vesselApi } from "../api/vessel.api";
import { adminApi } from "../../admin/api/admin.api";
import { toast } from "react-hot-toast";
import type { Vessel } from "../types/vessel.types";
import { useSocket } from "../../../providers/SocketProvider";
import { useQueryClient } from "@tanstack/react-query";

export const SelectVesselPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { activeVesselId, switchActiveVessel, setViewedVessel } =
    useActiveVessel();
  const { data: vessels = [], isLoading } = useVessels();
  const { socket } = useSocket();
  const queryClient = useQueryClient();

  const isCaptain = user?.role === "ADMIN";
  const isSuperAdmin = user?.role === "SUPER_ADMIN";

  // Active VIP Vessel single-active enforcement rule for regular users
  const currentActiveVipVessel = vessels.find(
    (v: Vessel) =>
      v.vesselMode === "VIP" &&
      ((v as any)._id === activeVesselId || v.id === activeVesselId) &&
      (v.vesselStatus === "Active" || v.isActive) &&
      !v.hasRequestedLeave &&
      !v.isOffboarded,
  );

  const isLockedByActiveVip = user?.role === "USER" && !!currentActiveVipVessel;

  // Listen for real-time join request approval socket events
  useEffect(() => {
    if (!socket) return;

    const handleJoinApproved = () => {
      queryClient.invalidateQueries({ queryKey: ["vessels"] });
      queryClient.invalidateQueries({ queryKey: ["user-vessels"] });
      toast.success("Your VIP vessel join request has been approved!");
    };

    socket.on("crew:join_approved", handleJoinApproved);

    return () => {
      socket.off("crew:join_approved", handleJoinApproved);
    };
  }, [socket, queryClient]);

  const { mutateAsync: createVessel, isPending: isCreating } =
    useCreateVessel();
  const { mutateAsync: activateVessel, isPending: isActivating } =
    useActivateVessel();
  const { mutateAsync: updateVessel } = useUpdateVessel();
  const { mutateAsync: deleteVessel } = useDeleteVessel();

  const handleDeactivate = async () => {
    try {
      await vesselApi.deactivateVessel();
      switchActiveVessel(null);
      queryClient.invalidateQueries({ queryKey: ["vessels"] });
      queryClient.invalidateQueries({ queryKey: ["user-vessels"] });
      toast.success("Vessel deactivated. Account is now off-contract.");
    } catch (e: any) {
      toast.error(e.response?.data?.message || "Failed to deactivate vessel.");
    }
  };

  const [activeTab, setActiveTab] = useState<
    "personal" | "vip" | "join" | "superadmin"
  >(isCaptain || isSuperAdmin ? "vip" : "personal");

  // Form & Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVessel, setEditingVessel] = useState<Vessel | null>(null);

  const [name, setName] = useState("");
  const [type, setType] = useState("Container Ship");

  // Join Passcode state
  const [inviteCode, setInviteCode] = useState("");
  const [isJoining, setIsJoining] = useState(false);

  // Scanned Passcode detection via URL
  const [scannedPasscodeNotification, setScannedPasscodeNotification] =
    useState<string | null>(null);

  useEffect(() => {
    const codeFromUrl = searchParams.get("code") || searchParams.get("invite");
    if (codeFromUrl) {
      setInviteCode(codeFromUrl.toUpperCase());
      setActiveTab("join");
      setScannedPasscodeNotification(codeFromUrl.toUpperCase());
      toast.success(
        `Invite passcode "${codeFromUrl.toUpperCase()}" auto-filled!`,
      );
    }
  }, [searchParams]);

  // QR Invite Modal state
  const [qrModalVessel, setQrModalVessel] = useState<Vessel | null>(null);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);

  // VIP creation state
  const [vipName, setVipName] = useState("");
  const [vipType, setVipType] = useState("Yacht / VIP Ship");
  const [isProvisioningVip, setIsProvisioningVip] = useState(false);

  // Super Admin Assign Captain state
  const [targetVesselId, setTargetVesselId] = useState("");
  const [targetCaptainId, setTargetCaptainId] = useState("");

  const handleActivate = async (id: string) => {
    try {
      await activateVessel(id);
      navigate(ROUTES.DASHBOARD);
    } catch (e: any) {
      toast.error(e.response?.data?.message || "Activation failed");
    }
  };

  const handleCreatePersonalVessel = async () => {
    if (!name) return;
    try {
      if (editingVessel) {
        const id = (editingVessel as any)._id || editingVessel.id;
        await updateVessel({
          vesselId: id,
          data: { name, type },
        });
        toast.success(`Vessel "${name}" updated successfully!`);
      } else {
        const created = await createVessel({
          name,
          type,
          vesselMode: "Personal",
        });
        toast.success(`Personal Vessel "${name}" created successfully!`);
        const newVesselId = (created as any)?._id || (created as any)?.id;
        if (newVesselId) {
          await activateVessel(newVesselId);
        }
      }
      setIsModalOpen(false);
      setEditingVessel(null);
      setName("");
    } catch (e: any) {
      toast.error(e.response?.data?.message || "Operation failed");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this vessel?")) return;
    try {
      await deleteVessel(id);
      toast.success("Personal vessel deleted.");
    } catch (e: any) {
      toast.error(e.response?.data?.message || "Deletion failed");
    }
  };

  const handleJoinVessel = async () => {
    if (!inviteCode) return;
    setIsJoining(true);
    try {
      await vesselApi.joinVessel({ inviteCode });
      toast.success("Join application submitted! Awaiting Captain approval.");
      setInviteCode("");
      setScannedPasscodeNotification(null);
    } catch (e: any) {
      toast.error(
        e.response?.data?.message || "Invalid or expired invite passcode",
      );
    } finally {
      setIsJoining(false);
    }
  };

  const handleCreateVipVessel = async () => {
    if (!vipName) return;
    setIsProvisioningVip(true);
    try {
      await vesselApi.createVessel({
        name: vipName,
        type: vipType,
        vesselMode: "VIP",
      });
      toast.success("VIP Vessel provisioned successfully!");
      setVipName("");
      queryClient.invalidateQueries({ queryKey: ["vessels"] });
    } catch (e: any) {
      toast.error(e.response?.data?.message || "Failed to create VIP vessel");
    } finally {
      setIsProvisioningVip(false);
    }
  };

  const handleAssignCaptain = async () => {
    if (!targetVesselId || !targetCaptainId) return;
    try {
      await adminApi.assignCaptainToVessel(targetVesselId, targetCaptainId);
      toast.success("Captain assigned successfully!");
      setTargetVesselId("");
      setTargetCaptainId("");
    } catch (e: any) {
      toast.error(e.response?.data?.message || "Captain assignment failed");
    }
  };

  const personalVessels = vessels.filter((v) => v.vesselMode !== "VIP");
  const vipVessels = vessels.filter((v) => v.vesselMode === "VIP");

  return (
    <div className="min-h-screen bg-bg-light p-4 md:p-8 font-sans flex flex-col gap-6 max-w-6xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-black tracking-tight">
              Vessel Fleet Registry & Workspace Selector
            </h1>
          </div>
          <p className="text-xs text-zinc-500 mt-1">
            Activate, provision, or view history for your operational ships.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isSuperAdmin && (
            <button
              onClick={() => navigate(ROUTES.WORKSPACE_HOME)}
              className="px-4 py-2 bg-[#0055d4] hover:bg-[#003fa3] text-xs font-bold text-white rounded-xl transition cursor-pointer"
            >
              🌐 Command Center
            </button>
          )}
        </div>
      </div>

      {/* Primary Category Selector Tabs */}
      <div className="flex flex-wrap items-center gap-2 bg-white p-2 rounded-2xl border border-zinc-200 shadow-2xs">
        <button
          onClick={() => setActiveTab("personal")}
          className={`px-4 py-2 text-xs font-extrabold rounded-xl transition cursor-pointer ${
            activeTab === "personal"
              ? "bg-[#0055d4] text-white shadow-xs"
              : "text-zinc-600 hover:bg-zinc-100"
          }`}
        >
          🚢 Personal Vessels ({personalVessels.length})
        </button>

        <button
          onClick={() => setActiveTab("vip")}
          className={`px-4 py-2 text-xs font-extrabold rounded-xl transition cursor-pointer ${
            activeTab === "vip"
              ? "bg-purple-700 text-white shadow-xs"
              : "text-zinc-600 hover:bg-zinc-100"
          }`}
        >
          ⭐ VIP Vessels ({vipVessels.length})
        </button>

        {!isCaptain && !isSuperAdmin && (
          <button
            onClick={() => setActiveTab("join")}
            className={`px-4 py-2 text-xs font-extrabold rounded-xl transition cursor-pointer ${
              activeTab === "join"
                ? "bg-emerald-600 text-white shadow-xs"
                : "text-zinc-600 hover:bg-zinc-100"
            }`}
          >
            🔑 Join VIP Vessel Passcode
          </button>
        )}

        {isSuperAdmin && (
          <button
            onClick={() => setActiveTab("superadmin")}
            className={`px-4 py-2 text-xs font-extrabold rounded-xl transition cursor-pointer ${
              activeTab === "superadmin"
                ? "bg-black text-white shadow-xs"
                : "text-zinc-600 hover:bg-zinc-100"
            }`}
          >
            🛡️ Provisioning & Captain Assignment
          </button>
        )}
      </div>

      {/* Tab Contents */}
      {isLoading ? (
        <div className="p-12 text-center text-xs text-zinc-400 font-semibold animate-pulse">
          Loading vessel fleet registries...
        </div>
      ) : (
        <>
          {/* Personal Vessels Tab */}
          {activeTab === "personal" && (
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-extrabold text-black uppercase tracking-wider">
                  Personal Vessels
                </h3>
                {!isCaptain && !isSuperAdmin && (
                  <button
                    onClick={() => {
                      setEditingVessel(null);
                      setName("");
                      setIsModalOpen(true);
                    }}
                    className="px-4 py-2 bg-[#0055d4] hover:bg-[#003fa3] text-xs font-extrabold text-white rounded-xl transition cursor-pointer"
                  >
                    + Create Personal Vessel
                  </button>
                )}
              </div>

              {(isCaptain || isSuperAdmin) && (
                <div className="p-4 bg-purple-50 border border-purple-200 rounded-2xl text-xs font-bold text-purple-950 flex items-center gap-2.5">
                  <span className="text-lg">🔒</span>
                  <span>
                    Captains & Admins provision VIP Vessels only. Personal
                    vessels are reserved for Crew Members.
                  </span>
                </div>
              )}

              {personalVessels.length === 0 ? (
                <div className="p-12 text-center bg-white border border-zinc-200 rounded-3xl flex flex-col items-center gap-2">
                  <span className="text-3xl">🚢</span>
                  <h4 className="text-sm font-bold text-black">
                    No Personal Vessels Found
                  </h4>
                  <p className="text-xs text-zinc-400 max-w-sm">
                    {isCaptain
                      ? "As a Captain, navigate to VIP Vessels tab to manage your assigned vessel."
                      : "Create your first personal vessel to begin logging operations."}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {personalVessels.map((v) => {
                    const id = (v as any)._id || v.id;
                    const isActive = activeVesselId === id;
                    const status =
                      v.vesselStatus || (v.isActive ? "Active" : "Draft");
                    const serviceDays = (v as any).serviceDays || 1;

                    return (
                      <div
                        key={id}
                        className={`rounded-3xl overflow-hidden shadow-sm flex flex-col justify-between border transition duration-200 hover:shadow-md ${
                          isActive
                            ? "bg-white border-2 border-[#0055d4] ring-4 ring-[#0055d4]/10"
                            : "bg-white border-zinc-200"
                        }`}
                      >
                        {/* Glassmorphism Card Header */}
                        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 p-4 text-white flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center text-xl font-bold">
                              🚢
                            </div>
                            <div className="flex flex-col">
                              <h4 className="text-base font-extrabold tracking-tight text-white">
                                {v.name}
                              </h4>
                              <span className="text-[10px] text-blue-200 font-mono uppercase tracking-wider">
                                {v.type}
                              </span>
                            </div>
                          </div>
                          {isActive ? (
                            <span className="text-[9px] font-extrabold uppercase bg-emerald-500 text-white px-2.5 py-1 rounded-full animate-pulse shadow-sm">
                              🟢 ACTIVE
                            </span>
                          ) : (
                            <span className="text-[9px] font-extrabold uppercase bg-white/10 text-white/80 px-2 py-0.5 rounded border border-white/20">
                              PERSONAL
                            </span>
                          )}
                        </div>

                        {/* Card Body */}
                        <div className="p-5 flex flex-col gap-3">
                          <div className="flex items-center justify-between text-xs border-b border-zinc-100 pb-3">
                            <span className="text-zinc-500 font-medium">
                              Accumulated Service
                            </span>
                            <span className="font-extrabold text-amber-900 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 text-[10px]">
                              ⏱️ {serviceDays} Days on board
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-xs">
                            <span className="text-zinc-500 font-medium">
                              Operational Status
                            </span>
                            <span className="font-extrabold text-zinc-700 uppercase text-[10px] bg-zinc-100 px-2 py-0.5 rounded border border-zinc-200">
                              {status}
                            </span>
                          </div>
                        </div>

                        {/* Card Actions Footer */}
                        <div className="p-4 bg-zinc-50/80 border-t border-zinc-150 flex flex-wrap items-center gap-2">
                          {isActive ? (
                            <button
                              onClick={handleDeactivate}
                              className="flex-1 py-2 px-3 bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 text-xs font-extrabold rounded-xl transition cursor-pointer shadow-2xs"
                              title="Deactivate vessel context and move account off-contract"
                            >
                              🔌 Deactivate (Off-Contract)
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                if (isLockedByActiveVip && !isActive) {
                                  toast.error(
                                    `You are currently an active crew member of VIP Vessel "${currentActiveVipVessel?.name}". You must submit a Leave Request before activating another vessel.`,
                                  );
                                  return;
                                }
                                switchActiveVessel(v);
                                handleActivate(id);
                              }}
                              disabled={
                                isActivating ||
                                (isLockedByActiveVip && !isActive)
                              }
                              className={`flex-1 py-2 px-3 text-xs font-extrabold rounded-xl transition cursor-pointer shadow-2xs ${
                                isLockedByActiveVip
                                  ? "bg-zinc-200 text-zinc-500 cursor-not-allowed border border-zinc-300"
                                  : "bg-[#0055d4] hover:bg-[#003fa3] text-white"
                              }`}
                            >
                              {isLockedByActiveVip
                                ? "🔒 Active VIP Locked"
                                : "Activate Workspace"}
                            </button>
                          )}
                          <button
                            onClick={() => {
                              setViewedVessel(v);
                              toast.success(
                                `Viewing "${v.name}" in Read-Only Mode.`,
                              );
                              navigate(ROUTES.HISTORY);
                            }}
                            className="py-2 px-3 bg-white hover:bg-zinc-100 border border-zinc-250 text-zinc-400 hover:text-zinc-900 text-xs font-bold rounded-xl transition cursor-pointer shadow-2xs"
                            title="View logbook history"
                          >
                            👁️ View Logs
                          </button>
                          {!isCaptain && !isSuperAdmin && (
                            <>
                              <button
                                onClick={() => {
                                  setEditingVessel(v);
                                  setName(v.name);
                                  setType(v.type);
                                  setIsModalOpen(true);
                                }}
                                className="px-2.5 py-2 bg-white border border-zinc-200 text-xs font-bold text-zinc-600 hover:bg-zinc-100 rounded-xl transition cursor-pointer"
                              >
                                ✏️
                              </button>
                              <button
                                onClick={() => handleDelete(id)}
                                className="px-2.5 py-2 bg-red-50 border border-red-200 text-xs font-bold text-red-600 hover:bg-red-100 rounded-xl transition cursor-pointer"
                              >
                                🗑️
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* VIP Vessels Tab */}
          {activeTab === "vip" && (
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-extrabold text-black uppercase tracking-wider">
                  VIP Fleet Vessels
                </h3>
                {isCaptain && (
                  <button
                    onClick={() => {
                      setVipName("");
                      setIsProvisioningVip(false);
                    }}
                    className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-xs font-extrabold text-white rounded-xl transition cursor-pointer"
                  >
                    + Provision VIP Vessel
                  </button>
                )}
              </div>

              {vipVessels.length === 0 ? (
                <div className="p-12 text-center bg-white border border-zinc-200 rounded-3xl flex flex-col items-center gap-2">
                  <span className="text-3xl">⭐</span>
                  <h4 className="text-sm font-bold text-black">
                    No VIP Vessels Assigned
                  </h4>
                  <p className="text-xs text-zinc-400 max-w-sm">
                    {isCaptain
                      ? "You do not have a VIP vessel assigned to your Captain account yet."
                      : "Use an invite passcode under 'Join VIP Vessel' to submit a crew application."}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {vipVessels.map((v) => {
                    const id = (v as any)._id || v.id;
                    const isActive = activeVesselId === id;
                    const status =
                      v.vesselStatus || (v.isActive ? "Active" : "Draft");
                    const serviceDays = (v as any).serviceDays || 1;

                    return (
                      <div
                        key={id}
                        className={`rounded-3xl overflow-hidden shadow-sm flex flex-col justify-between border transition duration-200 hover:shadow-md ${
                          isActive
                            ? "bg-white border-2 border-purple-600 ring-4 ring-purple-600/10"
                            : "bg-white border-zinc-200"
                        }`}
                      >
                        {/* Glassmorphism Card Header */}
                        <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-purple-950 p-4 text-white flex items-center justify-between">
                          <div className="flex items-center gap-3 mr-5">
                            <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center text-xl font-bold">
                              ⭐
                            </div>
                            <div className="flex flex-col">
                              <h4 className="text-base font-extrabold tracking-tight text-white">
                                {v.name}
                              </h4>
                              <span className="text-[10px] text-purple-200 font-mono uppercase tracking-wider">
                                {v.type}
                              </span>
                            </div>
                          </div>
                          {isActive ? (
                            <span className="text-[7px] font-extrabold uppercase bg-emerald-500 text-white px-2.5 py-1 rounded-full animate-pulse shadow-sm">
                              🟢 ACTIVE COCKPIT
                            </span>
                          ) : (
                            <span className="text-[7px] font-extrabold uppercase bg-purple-500/30 text-purple-200 px-2 py-0.5 rounded border border-purple-400/30">
                              VIP FLEET
                            </span>
                          )}
                        </div>

                        {/* Card Body */}
                        <div className="p-5 flex flex-col gap-3">
                          <div className="flex items-center justify-between text-xs border-b border-zinc-100 pb-3">
                            <span className="text-zinc-500 font-medium">
                              Accumulated Service
                            </span>
                            <span className="font-extrabold text-purple-900 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200 text-[10px]">
                              ⏱️ {serviceDays} Days on board
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-xs">
                            <span className="text-zinc-500 font-medium">
                              Assigned Officer Rank
                            </span>
                            <span className="font-extrabold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 text-[10px]">
                              {(v as any).userRank || user?.rank || "Officer"}
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-xs">
                            <span className="text-zinc-500 font-medium">
                              Roster Status
                            </span>
                            {v.isOffboarded ? (
                              <span className="text-[10px] font-extrabold text-amber-900 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                                🔒 Logbook Archive
                              </span>
                            ) : v.hasRequestedLeave ? (
                              <span className="text-[10px] font-extrabold text-amber-900 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                                ⏳ Leave Pending
                              </span>
                            ) : (
                              <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                {status}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Card Actions Footer */}
                        <div className="p-4 bg-zinc-50/80 border-t border-zinc-150 flex items-center gap-2">
                          <button
                            onClick={() => {
                              if (v.isOffboarded || v.hasRequestedLeave) {
                                setViewedVessel(v);
                                toast.success(
                                  `Viewing "${v.name}" logbook in Read-Only Mode.`,
                                );
                                navigate(ROUTES.HISTORY);
                              } else {
                                if (isLockedByActiveVip && !isActive) {
                                  toast.error(
                                    `You are currently an active crew member of VIP Vessel "${currentActiveVipVessel?.name}". You must submit a Leave Request before activating another vessel.`,
                                  );
                                  return;
                                }
                                switchActiveVessel(v);
                                handleActivate(id);
                              }
                            }}
                            disabled={
                              isActivating ||
                              (isLockedByActiveVip &&
                                !isActive &&
                                !v.isOffboarded &&
                                !v.hasRequestedLeave)
                            }
                            className={`flex-1 py-2 px-3 text-xs font-extrabold rounded-xl transition cursor-pointer shadow-2xs ${
                              isActive
                                ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                                : v.isOffboarded || v.hasRequestedLeave
                                  ? "bg-amber-600 hover:bg-amber-700 text-white"
                                  : isLockedByActiveVip
                                    ? "bg-zinc-200 text-zinc-500 cursor-not-allowed border border-zinc-300"
                                    : "bg-purple-700 hover:bg-purple-800 text-white"
                            }`}
                          >
                            {isActive
                              ? "✓ Active Cockpit"
                              : v.isOffboarded || v.hasRequestedLeave
                                ? "👁️ View Logbook (Read-Only)"
                                : isLockedByActiveVip
                                  ? "🔒 Active VIP Locked"
                                  : "Activate Command Cockpit"}
                          </button>

                          {(isCaptain || isSuperAdmin) && (
                            <button
                              onClick={() => {
                                setQrModalVessel(v);
                                setIsQrModalOpen(true);
                              }}
                              className="py-2 px-3 bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-900 text-xs font-extrabold rounded-xl transition cursor-pointer shadow-2xs"
                              title="Show Scannable Passcode QR Code"
                            >
                              📱 QR Passcode
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Join VIP Vessel Tab */}
          {activeTab === "join" && (
            <div className="bg-white border border-zinc-200 rounded-3xl p-6 shadow-sm max-w-xl mx-auto flex flex-col gap-5">
              <div className="flex items-center gap-3 border-b border-zinc-150 pb-4">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center font-bold text-[#0055d4]">
                  🔑
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-black">
                    Join VIP Vessel Roster
                  </h3>
                  <p className="text-xs text-zinc-500">
                    Enter the scannable 8-character invite passcode provided by
                    the Captain.
                  </p>
                </div>
              </div>

              {scannedPasscodeNotification && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between text-xs font-bold text-emerald-950">
                  <span>
                    ✨ Auto-filled invite passcode:{" "}
                    <code>{scannedPasscodeNotification}</code>
                  </span>
                  <button
                    onClick={() => setScannedPasscodeNotification(null)}
                    className="text-emerald-700 hover:text-emerald-950"
                  >
                    ✕
                  </button>
                </div>
              )}

              <div className="flex flex-col gap-2">
                <label className="text-xs font-extrabold text-zinc-700 uppercase tracking-wider">
                  Invite Passcode
                </label>
                <input
                  type="text"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                  placeholder="e.g. VIP-8X92"
                  className="w-full px-4 py-3 bg-zinc-50 border border-zinc-300 rounded-2xl font-mono text-sm font-bold text-black focus:outline-none focus:border-[#0055d4] uppercase"
                />
              </div>

              <button
                onClick={handleJoinVessel}
                disabled={isJoining || !inviteCode}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-2xl shadow-sm transition cursor-pointer disabled:opacity-50"
              >
                {isJoining
                  ? "Submitting Application..."
                  : "Submit Join Application →"}
              </button>
            </div>
          )}

          {/* Super Admin Provisioning Tab */}
          {activeTab === "superadmin" && isSuperAdmin && (
            <div className="flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border border-zinc-200 rounded-3xl p-6 shadow-sm flex flex-col gap-4">
                  <h3 className="text-sm font-extrabold text-black uppercase tracking-wider border-b border-zinc-150 pb-3">
                    Provision New VIP Vessel
                  </h3>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-zinc-600">
                      Vessel Name
                    </label>
                    <input
                      type="text"
                      value={vipName}
                      onChange={(e) => setVipName(e.target.value)}
                      placeholder="e.g. M/Y Ocean Express"
                      className="px-3.5 py-2.5 bg-zinc-50 border border-zinc-300 rounded-xl text-xs font-bold"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-zinc-600">
                      Vessel Type
                    </label>
                    <select
                      value={vipType}
                      onChange={(e) => setVipType(e.target.value)}
                      className="px-3.5 py-2.5 bg-zinc-50 border border-zinc-300 rounded-xl text-xs font-bold"
                    >
                      <option value="Yacht / VIP Ship">Yacht / VIP Ship</option>
                      <option value="Luxury Cruise">Luxury Cruise</option>
                      <option value="Container Vessel">Container Vessel</option>
                      <option value="Tanker Ship">Tanker Ship</option>
                    </select>
                  </div>
                  <button
                    onClick={handleCreateVipVessel}
                    disabled={isProvisioningVip || !vipName}
                    className="py-2.5 bg-purple-700 hover:bg-purple-800 text-white font-extrabold text-xs rounded-xl transition cursor-pointer disabled:opacity-50"
                  >
                    {isProvisioningVip
                      ? "Provisioning..."
                      : "Provision VIP Vessel"}
                  </button>
                </div>

                <div className="bg-white border border-zinc-200 rounded-3xl p-6 shadow-sm flex flex-col gap-4">
                  <h3 className="text-sm font-extrabold text-black uppercase tracking-wider border-b border-zinc-150 pb-3">
                    Assign Captain to VIP Vessel
                  </h3>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-zinc-600">
                      Target VIP Vessel
                    </label>
                    <select
                      value={targetVesselId}
                      onChange={(e) => setTargetVesselId(e.target.value)}
                      className="px-3.5 py-2.5 bg-zinc-50 border border-zinc-300 rounded-xl text-xs font-bold"
                    >
                      <option value="">-- Select VIP Vessel --</option>
                      {vipVessels.map((v) => (
                        <option
                          key={(v as any)._id || v.id}
                          value={(v as any)._id || v.id}
                        >
                          {v.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-zinc-600">
                      Captain User ID
                    </label>
                    <input
                      type="text"
                      value={targetCaptainId}
                      onChange={(e) => setTargetCaptainId(e.target.value)}
                      placeholder="Mongo User Object ID"
                      className="px-3.5 py-2.5 bg-zinc-50 border border-zinc-300 rounded-xl text-xs font-bold font-mono"
                    />
                  </div>
                  <button
                    onClick={handleAssignCaptain}
                    disabled={!targetVesselId || !targetCaptainId}
                    className="py-2.5 bg-black hover:bg-zinc-800 text-white font-extrabold text-xs rounded-xl transition cursor-pointer disabled:opacity-50"
                  >
                    Assign Captain
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Modal for Creating / Editing Personal Vessels */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white border border-zinc-200 rounded-3xl p-6 shadow-xl max-w-md w-full flex flex-col gap-4">
            <h3 className="text-base font-extrabold text-black">
              {editingVessel
                ? "Edit Personal Vessel"
                : "Create Personal Vessel"}
            </h3>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-zinc-600">
                Vessel Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. M/V Ocean Explorer"
                className="px-3.5 py-2.5 bg-zinc-50 border border-zinc-300 rounded-xl text-xs font-bold"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-zinc-600">
                Vessel Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="px-3.5 py-2.5 bg-zinc-50 border border-zinc-300 rounded-xl text-xs font-bold"
              >
                <option value="Container Ship">Container Ship</option>
                <option value="Tanker Ship">Tanker Ship</option>
                <option value="Bulk Carrier">Bulk Carrier</option>
                <option value="Tug Boat">Tug Boat</option>
                <option value="Yacht / VIP Ship">Yacht / VIP Ship</option>
              </select>
            </div>
            <div className="flex items-center justify-end gap-2 mt-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-xs font-bold text-zinc-700 rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleCreatePersonalVessel}
                disabled={isCreating || !name}
                className="px-4 py-2 bg-[#0055d4] hover:bg-[#003fa3] text-xs font-bold text-white rounded-xl transition cursor-pointer disabled:opacity-50"
              >
                {editingVessel ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QR Code Invite Passcode Modal */}
      {isQrModalOpen && qrModalVessel && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white border border-zinc-200 rounded-3xl p-6 shadow-xl max-w-sm w-full flex flex-col items-center gap-4 text-center">
            <h3 className="text-base font-extrabold text-black">
              {qrModalVessel.name} Invite Passcode
            </h3>
            <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-2xl">
              <QRCodeSVG
                value={`${window.location.origin}/select-vessel?code=${qrModalVessel.inviteCode}`}
                size={180}
              />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-bold text-zinc-500">
                Share Passcode with Crew:
              </span>
              <code className="text-lg font-extrabold font-mono text-purple-700 bg-purple-50 px-3 py-1 rounded-xl border border-purple-200">
                {qrModalVessel.inviteCode || "VIP-PASS"}
              </code>
            </div>
            <button
              onClick={() => setIsQrModalOpen(false)}
              className="w-full py-2.5 bg-zinc-900 hover:bg-black text-white text-xs font-extrabold rounded-xl transition cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SelectVesselPage;
