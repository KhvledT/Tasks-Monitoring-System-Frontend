import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi, type AdminUserListItem } from "../api/admin.api";
import { toast } from "react-hot-toast";

export const CaptainsManagementPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [selectedCaptain, setSelectedCaptain] = useState<AdminUserListItem | null>(null);
  const [isDemoteOpen, setIsDemoteOpen] = useState(false);
  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const [transferVesselId, setTransferVesselId] = useState("");
  const [targetCaptainId, setTargetCaptainId] = useState("");
  const [transferReason, setTransferReason] = useState("");

  // Queries
  const { data: captainsData, isLoading } = useQuery({
    queryKey: ["captains", search],
    queryFn: () => adminApi.listCaptains({ search }),
  });

  const captains = captainsData?.items || [];

  // Mutations
  const demoteMutation = useMutation({
    mutationFn: (id: string) => adminApi.updateRole(id, "USER"),
    onSuccess: () => {
      toast.success("Captain demoted to User successfully.");
      setIsDemoteOpen(false);
      setSelectedCaptain(null);
      queryClient.invalidateQueries({ queryKey: ["captains"] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to demote Captain.");
    },
  });

  const suspendMutation = useMutation({
    mutationFn: (id: string) => adminApi.suspendUser(id),
    onSuccess: () => {
      toast.success("Captain suspended.");
      queryClient.invalidateQueries({ queryKey: ["captains"] });
    },
  });

  const activateMutation = useMutation({
    mutationFn: (id: string) => adminApi.activateUser(id),
    onSuccess: () => {
      toast.success("Captain reactivated.");
      queryClient.invalidateQueries({ queryKey: ["captains"] });
    },
  });

  const transferMutation = useMutation({
    mutationFn: () =>
      adminApi.assignCaptainToVessel(transferVesselId, targetCaptainId, transferReason),
    onSuccess: () => {
      toast.success("Vessel ownership transferred with audit log!");
      setIsTransferOpen(false);
      setTransferVesselId("");
      setTargetCaptainId("");
      setTransferReason("");
      queryClient.invalidateQueries({ queryKey: ["captains"] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Transfer failed.");
    },
  });

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto p-4 md:p-8 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-sky-600 bg-sky-50 px-2.5 py-0.5 rounded border border-sky-200">
            Platform Governance
          </span>
          <h1 className="text-2xl font-extrabold text-black tracking-tight mt-1">
            Captains Management Module
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Dedicated portal for monitoring Captain accounts, vessel commands, roster sizes, and ownership transfers.
          </p>
        </div>
        <button
          onClick={() => setIsTransferOpen(true)}
          className="px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl transition shadow-xs cursor-pointer"
        >
          ⇄ Transfer Vessel Ownership
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white border border-zinc-200 rounded-2xl p-4 flex gap-4 shadow-xs">
        <input
          type="text"
          placeholder="Search Captains by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-zinc-50 border border-zinc-200 px-3.5 py-2 text-xs font-semibold rounded-xl text-black focus:outline-none focus:border-sky-500"
        />
      </div>

      {/* Captains Directory Table */}
      <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-xs overflow-hidden">
        {isLoading ? (
          <p className="text-xs text-zinc-400 italic">Loading Captains database...</p>
        ) : captains.length === 0 ? (
          <p className="text-xs text-zinc-400 italic">No Captains found matching query criteria.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-150 text-[10px] uppercase font-extrabold text-zinc-400 tracking-wider">
                  <th className="py-3 px-4">Captain Name</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Role Title</th>
                  <th className="py-3 px-4">Account Status</th>
                  <th className="py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 text-xs font-semibold text-black">
                {captains.map((capt) => {
                  const id = capt.id || capt._id;
                  return (
                    <tr key={id} className="hover:bg-zinc-50 transition">
                      <td className="py-3.5 px-4 font-bold text-sky-950">{capt.fullName}</td>
                      <td className="py-3.5 px-4 font-mono text-zinc-500">{capt.email}</td>
                      <td className="py-3.5 px-4">
                        <span className="bg-sky-50 text-sky-700 px-2.5 py-0.5 rounded font-extrabold text-[10px] border border-sky-200">
                          Captain
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        {capt.isActive ? (
                          <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full text-[10px] font-bold border border-emerald-200">
                            Active
                          </span>
                        ) : (
                          <span className="bg-red-50 text-red-700 px-2 py-0.5 rounded-full text-[10px] font-bold border border-red-200">
                            Suspended
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          {capt.isActive ? (
                            <button
                              onClick={() => suspendMutation.mutate(id)}
                              className="px-2.5 py-1 bg-white border border-red-200 text-red-600 text-[10px] font-bold hover:bg-red-50 rounded-lg cursor-pointer"
                            >
                              Suspend
                            </button>
                          ) : (
                            <button
                              onClick={() => activateMutation.mutate(id)}
                              className="px-2.5 py-1 bg-white border border-emerald-200 text-emerald-600 text-[10px] font-bold hover:bg-emerald-50 rounded-lg cursor-pointer"
                            >
                              Reactivate
                            </button>
                          )}
                          <button
                            onClick={() => {
                              setSelectedCaptain(capt);
                              setIsDemoteOpen(true);
                            }}
                            className="px-2.5 py-1 bg-white border border-amber-200 text-amber-600 text-[10px] font-bold hover:bg-amber-50 rounded-lg cursor-pointer"
                          >
                            Demote to User
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Demote Captain Modal */}
      {isDemoteOpen && selectedCaptain && (
        <div className="fixed inset-0 bg-black/45 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-zinc-200 rounded-2xl w-full max-w-sm p-6 shadow-2xl flex flex-col gap-4">
            <h3 className="text-sm font-bold text-black border-b border-zinc-150 pb-2.5">
              Demote Captain to Standard User
            </h3>
            <p className="text-xs text-zinc-500">
              Are you sure you want to demote <strong>{selectedCaptain.fullName}</strong> ({selectedCaptain.email}) to standard User role? Captain privileges will be revoked immediately.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => demoteMutation.mutate(selectedCaptain.id || selectedCaptain._id)}
                disabled={demoteMutation.isPending}
                className="flex-1 py-2 bg-amber-600 hover:bg-amber-700 text-xs font-bold text-white rounded-xl cursor-pointer"
              >
                Confirm Demotion
              </button>
              <button
                onClick={() => setIsDemoteOpen(false)}
                className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-xs font-bold text-black rounded-xl cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Transfer Vessel Ownership Modal */}
      {isTransferOpen && (
        <div className="fixed inset-0 bg-black/45 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-zinc-200 rounded-2xl w-full max-w-md p-6 shadow-2xl flex flex-col gap-4">
            <h3 className="text-sm font-bold text-black border-b border-zinc-150 pb-2.5">
              Transfer Vessel Ownership
            </h3>
            <div className="flex flex-col gap-3 text-xs">
              <div>
                <label className="font-bold text-zinc-500">Target VIP Vessel ID</label>
                <input
                  type="text"
                  placeholder="Enter Vessel ID..."
                  value={transferVesselId}
                  onChange={(e) => setTransferVesselId(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 p-2.5 rounded-xl text-black font-mono mt-1"
                />
              </div>

              <div>
                <label className="font-bold text-zinc-500">New Captain</label>
                <select
                  value={targetCaptainId}
                  onChange={(e) => setTargetCaptainId(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 p-2.5 rounded-xl text-black font-semibold mt-1 cursor-pointer"
                >
                  <option value="">-- Select New Captain --</option>
                  {captains.map((c) => (
                    <option key={c.id || c._id} value={c.id || c._id}>
                      {c.fullName} ({c.email})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-zinc-500">Reason for Ownership Transfer</label>
                <textarea
                  placeholder="e.g. Captain reassigned to new fleet sector."
                  value={transferReason}
                  onChange={(e) => setTransferReason(e.target.value)}
                  rows={2}
                  className="w-full bg-zinc-50 border border-zinc-200 p-2.5 rounded-xl text-black mt-1"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => transferMutation.mutate()}
                disabled={transferMutation.isPending || !transferVesselId || !targetCaptainId}
                className="flex-1 py-2 bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-xs font-bold text-white rounded-xl cursor-pointer"
              >
                Confirm Ownership Transfer
              </button>
              <button
                onClick={() => setIsTransferOpen(false)}
                className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-xs font-bold text-black rounded-xl cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CaptainsManagementPage;
