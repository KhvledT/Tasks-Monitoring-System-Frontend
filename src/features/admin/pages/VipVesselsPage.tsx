import React, { useState, useEffect, useMemo } from "react";
import { QRCodeSVG } from "qrcode.react";
import { vesselApi } from "../../vessel/api/vessel.api";
import { adminApi, type AdminUserListItem } from "../api/admin.api";
import type { Vessel } from "../../vessel/types/vessel.types";
import { toast } from "react-hot-toast";

export const VipVesselsPage: React.FC = () => {
  const [vipVessels, setVipVessels] = useState<Vessel[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Vessel Provisioning Form
  const [name, setName] = useState("");
  const [type, setType] = useState("Container");
  const [grt, setGrt] = useState("");
  const [dwt, setDwt] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  // Captain Selection Modal
  const [activeVesselForAssignment, setActiveVesselForAssignment] = useState<Vessel | null>(null);
  const [captainsList, setCaptainsList] = useState<AdminUserListItem[]>([]);
  const [isCaptainsLoading, setIsCaptainsLoading] = useState(false);
  const [selectedCaptainId, setSelectedCaptainId] = useState<string>("");
  const [assignmentReason, setAssignmentReason] = useState("");
  const [isAssigning, setIsAssigning] = useState(false);

  // QR Code Modal
  const [activeVesselForQr, setActiveVesselForQr] = useState<Vessel | null>(null);

  const loadVessels = async () => {
    setIsLoading(true);
    try {
      const res = await vesselApi.getVessels();
      const list = res.result || [];
      setVipVessels(list.filter((v: Vessel) => v.vesselMode === "VIP"));
    } catch (e) {
      console.error("Failed to load vessels:", e);
      toast.error("Failed to fetch VIP vessels list.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadVessels();
  }, []);

  // Fetch Captains list when Assign Captain modal is opened
  useEffect(() => {
    if (!activeVesselForAssignment) {
      setCaptainsList([]);
      setSelectedCaptainId("");
      setAssignmentReason("");
      return;
    }

    setIsCaptainsLoading(true);
    adminApi
      .listCaptains({ limit: 100 })
      .then((res) => {
        const items = res?.items || (res as any)?.docs || [];
        setCaptainsList(items);
        if (items.length > 0) {
          const firstId = items[0]._id || items[0].id || "";
          setSelectedCaptainId(firstId);
        }
      })
      .catch((err) => {
        console.error("Failed to load captains:", err);
        toast.error("Failed to load available captains.");
      })
      .finally(() => {
        setIsCaptainsLoading(false);
      });
  }, [activeVesselForAssignment]);

  const handleCreateVip = async () => {
    if (!name.trim()) {
      toast.error("Please enter a vessel name.");
      return;
    }
    setIsCreating(true);
    try {
      await vesselApi.createVessel({
        name: name.trim(),
        type,
        vesselMode: "VIP",
        grt: grt ? Number(grt) : undefined,
        dwt: dwt ? Number(dwt) : undefined,
      });
      toast.success(`VIP Vessel "${name}" created successfully.`);
      setName("");
      setGrt("");
      setDwt("");
      loadVessels();
    } catch (e: any) {
      toast.error(e.response?.data?.message || "Failed to create VIP vessel.");
    } finally {
      setIsCreating(false);
    }
  };

  const handleConfirmAssignment = async () => {
    if (!activeVesselForAssignment || !selectedCaptainId) {
      toast.error("Please select a captain.");
      return;
    }

    const vesselId = (activeVesselForAssignment as any)._id || activeVesselForAssignment.id;
    setIsAssigning(true);
    try {
      await adminApi.assignCaptainToVessel(vesselId, selectedCaptainId, assignmentReason || undefined);
      toast.success("Captain assigned to VIP vessel successfully.");
      setActiveVesselForAssignment(null);
      loadVessels();
    } catch (e: any) {
      toast.error(e.response?.data?.message || "Failed to assign captain.");
    } finally {
      setIsAssigning(false);
    }
  };

  const handleDeleteVip = async (id: string, vesselName: string) => {
    if (
      confirm(
        `Are you sure you want to delete VIP Vessel "${vesselName}"?\n\nThis will remove the vessel from the active fleet registry.`
      )
    ) {
      try {
        await vesselApi.deleteVessel(id);
        toast.success(`VIP Vessel "${vesselName}" deleted successfully.`);
        loadVessels();
      } catch (e: any) {
        toast.error(e.response?.data?.message || "Failed to delete VIP vessel.");
      }
    }
  };

  const captainVesselMap = useMemo(() => {
    const map = new Map<string, string>();
    vipVessels.forEach((v) => {
      const captId = typeof v.captainId === "object" ? (v.captainId as any)?._id : String(v.captainId || "");
      if (captId) {
        map.set(captId, v.name);
      }
    });
    return map;
  }, [vipVessels]);

  return (
    <div className="flex flex-col gap-6 p-6 font-sans max-w-7xl mx-auto animate-fade-in pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-indigo-950 to-slate-900 text-white p-6 rounded-3xl shadow-xl border border-purple-800/40 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-purple-300 bg-white/10 px-3 py-1 rounded-full border border-white/10">
            VIP Fleet Operations
          </span>
          <h1 className="text-2xl font-extrabold text-white tracking-tight mt-2">
            VIP Vessels & Captain Assignments
          </h1>
          <p className="text-xs text-purple-200/80 mt-1">
            Provision dedicated shipboard instances, assign commanding captains, and generate scannable QR joining passes.
          </p>
        </div>

        <button
          onClick={loadVessels}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl transition cursor-pointer border border-white/15 shrink-0 flex items-center gap-1.5"
        >
          <span>🔄</span>
          <span>Refresh Fleet</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Vessel Provisioning Card */}
        <div className="bg-white border border-zinc-200 rounded-3xl p-6 shadow-sm flex flex-col gap-4 h-fit">
          <div className="flex items-center gap-3 border-b border-zinc-150 pb-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 border border-purple-200 flex items-center justify-center font-bold text-xl">
              🚢
            </div>
            <div>
              <h3 className="text-base font-extrabold text-black">Provision VIP Vessel</h3>
              <p className="text-xs text-zinc-400">Create a new dedicated vessel for captain assignment.</p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-zinc-400 uppercase font-mono">Vessel Name *</label>
              <input
                type="text"
                placeholder="e.g. MV VIP Poseidon"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-black placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-zinc-400 uppercase font-mono">Vessel Type *</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-bold text-black focus:outline-none cursor-pointer"
              >
                <option value="Container">Container</option>
                <option value="Tanker">Tanker</option>
                <option value="Bulk">Bulk Carrier</option>
                <option value="LPG">LPG / Gas Carrier</option>
                <option value="Passenger">Passenger / Cruise</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-zinc-400 uppercase font-mono">GRT (Tons)</label>
                <input
                  type="number"
                  placeholder="e.g. 45000"
                  value={grt}
                  onChange={(e) => setGrt(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-black focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-zinc-400 uppercase font-mono">DWT (Tons)</label>
                <input
                  type="number"
                  placeholder="e.g. 60000"
                  value={dwt}
                  onChange={(e) => setDwt(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-black focus:outline-none"
                />
              </div>
            </div>

            <button
              onClick={handleCreateVip}
              disabled={isCreating || !name.trim()}
              className="w-full mt-2 py-3 bg-[#0055d4] hover:bg-[#003fa3] disabled:opacity-50 text-xs font-extrabold text-white rounded-xl transition cursor-pointer shadow-md flex items-center justify-center gap-2"
            >
              <span>{isCreating ? "Provisioning..." : "✦ Provision VIP Vessel"}</span>
            </button>
          </div>
        </div>

        {/* VIP Vessels List */}
        <div className="lg:col-span-2 bg-white border border-zinc-200 rounded-3xl p-6 shadow-sm flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-zinc-150 pb-3">
            <div>
              <h3 className="text-base font-extrabold text-black">Active VIP Fleet</h3>
              <p className="text-xs text-zinc-400">Total {vipVessels.length} VIP vessel(s) provisioned.</p>
            </div>
            <span className="text-xs font-bold text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
              VIP Fleet Active
            </span>
          </div>

          {isLoading ? (
            <p className="text-xs text-zinc-400 italic py-12 text-center">Loading VIP vessels fleet...</p>
          ) : vipVessels.length === 0 ? (
            <div className="p-12 text-center bg-zinc-50 rounded-2xl border border-zinc-150">
              <p className="text-sm font-bold text-zinc-600">No VIP vessels provisioned yet.</p>
              <p className="text-xs text-zinc-400 mt-1">Use the form on the left to provision your first VIP vessel.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {vipVessels.map((v) => {
                const id = (v as any)._id || v.id;
                const captObj = typeof v.captainId === "object" ? (v.captainId as any) : null;
                const captName = captObj?.fullName || captObj?.email || (typeof v.captainId === "string" ? v.captainId : null);
                const captEmail = captObj?.email || "";
                const captAvatar = captObj?.avatarUrl || null;
                const captInitial = captName ? captName[0]?.toUpperCase() : "C";

                return (
                  <div
                    key={id}
                    className="border border-zinc-200 rounded-2xl p-4 flex flex-col justify-between gap-3 bg-zinc-50/60 hover:bg-zinc-50 transition shadow-2xs"
                  >
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-black uppercase tracking-wider text-purple-700 bg-purple-100/70 px-2.5 py-0.5 rounded border border-purple-200 font-mono">
                          {v.type} Vessel
                        </span>
                        <span className="text-[10px] font-bold text-zinc-500 font-mono bg-white px-2 py-0.5 rounded border border-zinc-200">
                          Pass: {v.inviteCode || "N/A"}
                        </span>
                      </div>

                      <h4 className="text-base font-extrabold text-black">{v.name}</h4>

                      {/* Captain Info Box */}
                      <div className="p-3 bg-white border border-zinc-200 rounded-xl flex items-center justify-between gap-3 mt-1">
                        <div className="flex items-center gap-2.5 overflow-hidden">
                          {captName ? (
                            captAvatar ? (
                              <img
                                src={captAvatar}
                                alt={captName}
                                className="w-8 h-8 rounded-full object-cover border border-zinc-200 shrink-0"
                              />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center font-black text-xs border border-sky-200 shrink-0">
                                {captInitial}
                              </div>
                            )
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs border border-amber-200 shrink-0">
                              ⚠️
                            </div>
                          )}

                          <div className="flex flex-col overflow-hidden">
                            <span className="text-[9px] font-extrabold text-zinc-400 uppercase font-mono">Command Captain</span>
                            <span className="text-xs font-bold text-black truncate">
                              {captName ? `Capt. ${captName}` : "Unassigned Captain"}
                            </span>
                            {captEmail && <span className="text-[10px] text-zinc-400 font-mono truncate">{captEmail}</span>}
                          </div>
                        </div>

                        {captName ? (
                          <span className="text-[9px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 shrink-0">
                            Active
                          </span>
                        ) : (
                          <span className="text-[9px] font-extrabold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 shrink-0">
                            Vacant
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 pt-2 border-t border-zinc-200">
                      <button
                        onClick={() => setActiveVesselForAssignment(v)}
                        className="flex-1 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-extrabold rounded-xl transition cursor-pointer text-center shadow-2xs"
                      >
                        {captName ? "🔄 Reassign Captain" : "➕ Assign Captain"}
                      </button>
                      <button
                        onClick={() => setActiveVesselForQr(v)}
                        className="px-3 py-2 bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-900 text-xs font-bold rounded-xl transition cursor-pointer"
                        title="Show Scannable QR Pass"
                      >
                        📱 QR Pass
                      </button>
                      <button
                        onClick={() => handleDeleteVip(id, v.name)}
                        className="px-3 py-2 bg-white border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold rounded-xl transition cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Assign Captain Selection Modal */}
      {activeVesselForAssignment && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white border border-zinc-200 rounded-3xl w-full max-w-lg p-6 shadow-2xl flex flex-col gap-5">
            <div className="flex items-center justify-between border-b border-zinc-150 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-sky-100 text-sky-700 border border-sky-200 flex items-center justify-center font-bold text-xl">
                  ⚓
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-black">
                    Assign Command Captain
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Vessel: <strong>{activeVesselForAssignment.name}</strong>
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveVesselForAssignment(null)}
                className="p-2 text-zinc-400 hover:text-black rounded-xl hover:bg-zinc-100 transition cursor-pointer text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {isCaptainsLoading ? (
              <p className="text-xs text-zinc-400 italic py-8 text-center">Loading registered captain accounts...</p>
            ) : captainsList.length === 0 ? (
              <div className="p-6 text-center bg-amber-50 rounded-2xl border border-amber-200">
                <p className="text-xs text-amber-900 font-bold">No captain accounts found on platform.</p>
                <p className="text-[11px] text-amber-700 mt-1">
                  Promote a user to Captain role in the Users Directory first.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <label className="text-[10px] font-bold text-zinc-400 uppercase font-mono">
                  Select Captain from Directory ({captainsList.length} Available)
                </label>

                <div className="max-h-60 overflow-y-auto flex flex-col gap-2 border border-zinc-200 rounded-2xl p-2 bg-zinc-50/50">
                  {captainsList.map((c) => {
                    const cId = c._id || c.id || "";
                    const avatar = (c as any).avatarUrl || null;
                    const initial = (c.fullName || c.email || "C")[0]?.toUpperCase();
                    const isSelected = selectedCaptainId === cId;
                    const assignedVesselName = captainVesselMap.get(cId);

                    return (
                      <div
                        key={cId}
                        onClick={() => setSelectedCaptainId(cId)}
                        className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                          isSelected
                            ? "bg-sky-50 border-sky-500 shadow-2xs"
                            : "bg-white border-zinc-200 hover:bg-zinc-50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {avatar ? (
                            <img
                              src={avatar}
                              alt={c.fullName}
                              className="w-9 h-9 rounded-full object-cover border border-zinc-200 shrink-0"
                            />
                          ) : (
                            <div className="w-9 h-9 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center font-black text-xs border border-sky-200 shrink-0">
                              {initial}
                            </div>
                          )}

                          <div className="flex flex-col">
                            <span className="text-xs font-extrabold text-black">{c.fullName || "Captain Officer"}</span>
                            <span className="text-[10px] text-zinc-400 font-mono">{c.email}</span>
                            {assignedVesselName && (
                              <span className="text-[9px] font-extrabold text-purple-600 mt-0.5">
                                Currently assigned: {assignedVesselName}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {isSelected && (
                            <span className="text-[10px] font-black text-sky-700 bg-sky-100 px-2.5 py-0.5 rounded-full border border-sky-200">
                              ✓ Selected
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex flex-col gap-1 mt-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase font-mono">Assignment Reason / Log Note (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Regular rotation transfer"
                    value={assignmentReason}
                    onChange={(e) => setAssignmentReason(e.target.value)}
                    className="w-full px-3.5 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-black focus:outline-none"
                  />
                </div>
              </div>
            )}

            <div className="flex items-center gap-2 border-t border-zinc-150 pt-3">
              <button
                onClick={handleConfirmAssignment}
                disabled={isAssigning || !selectedCaptainId || captainsList.length === 0}
                className="flex-1 py-2.5 bg-[#0055d4] hover:bg-[#003fa3] disabled:opacity-50 text-xs font-extrabold text-white rounded-xl transition cursor-pointer text-center shadow-md"
              >
                {isAssigning ? "Transferring Ownership..." : "Confirm Captain Assignment"}
              </button>
              <button
                onClick={() => setActiveVesselForAssignment(null)}
                className="px-4 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-xs font-bold text-black rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIP Vessel QR Code Pass Modal */}
      {activeVesselForQr && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-zinc-200 rounded-3xl w-full max-w-md p-6 shadow-2xl flex flex-col items-center gap-5 text-center">
            <div className="flex items-center justify-between w-full border-b border-zinc-150 pb-3">
              <span className="text-[10px] font-extrabold uppercase text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded border border-purple-200">
                Official VIP Vessel QR Pass
              </span>
              <button
                onClick={() => setActiveVesselForQr(null)}
                className="text-zinc-400 hover:text-black font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <h3 className="text-xl font-extrabold text-black">{activeVesselForQr.name}</h3>

            <div className="p-3 bg-zinc-950 rounded-2xl shadow-md">
              <QRCodeSVG
                value={`${window.location.origin}/select-vessel?passcode=${activeVesselForQr.inviteCode || "INV-SAMPLE"}`}
                size={180}
                bgColor="#09090b"
                fgColor="#ffffff"
                level="H"
                includeMargin={true}
              />
            </div>

            <div className="flex flex-col gap-1 w-full bg-zinc-50 border border-zinc-200 p-3 rounded-2xl">
              <span className="text-[9px] font-bold text-zinc-400 uppercase font-mono">Passcode</span>
              <span className="text-lg font-mono font-extrabold text-black tracking-widest">
                {activeVesselForQr.inviteCode || "INV-SAMPLE"}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 w-full">
              <button
                onClick={() => {
                  const url = `${window.location.origin}/select-vessel?passcode=${activeVesselForQr.inviteCode || "INV-SAMPLE"}`;
                  navigator.clipboard.writeText(url);
                  toast.success("Joining URL copied to clipboard!");
                }}
                className="py-2.5 bg-purple-600 hover:bg-purple-700 text-xs font-bold text-white rounded-xl transition cursor-pointer"
              >
                📋 Copy Link
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(activeVesselForQr.inviteCode || "INV-SAMPLE");
                  toast.success("Passcode copied!");
                }}
                className="py-2.5 bg-primary hover:bg-[#003fa3] text-xs font-bold text-white rounded-xl transition cursor-pointer"
              >
                🔑 Copy Passcode
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VipVesselsPage;
