import React, { useState, useEffect, useMemo } from "react";
import { adminApi, type AdminUser, type AdminUserDetail } from "../api/admin.api";
import { toast } from "react-hot-toast";
import { ImagePreviewModal } from "../../../shared/components/ImagePreviewModal";

export const UsersManagementPage: React.FC = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [search, setSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [isLoading, setIsLoading] = useState(true);

  // Selected User for UserInfoModal
  const [activeModalUser, setActiveModalUser] = useState<AdminUser | null>(null);
  const [userDetail, setUserDetail] = useState<AdminUserDetail | null>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);

  // Image Preview Lightbox
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isActionPending, setIsActionPending] = useState(false);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const res = await adminApi.listUsers({ search, limit: 100 });
      setUsers(res?.items || (res as any)?.docs || []);
    } catch (err) {
      console.error("Failed to load users:", err);
      toast.error("Failed to fetch user directory.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [search]);

  const getUserId = (u: any): string => u?.id || u?._id || "";

  // Fetch detailed user profile when activeModalUser changes
  useEffect(() => {
    if (!activeModalUser) {
      setUserDetail(null);
      return;
    }
    const uId = getUserId(activeModalUser);
    if (!uId) return;

    setIsDetailLoading(true);
    adminApi
      .getUserDetails(uId)
      .then((res) => {
        setUserDetail(res);
      })
      .catch(() => {
        setUserDetail(null);
      })
      .finally(() => {
        setIsDetailLoading(false);
      });
  }, [activeModalUser]);

  // Filtered users list
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      // Role filter
      if (selectedRole !== "ALL" && u.role !== selectedRole) {
        return false;
      }
      // Status filter
      if (selectedStatus === "ACTIVE" && !u.isActive) return false;
      if (selectedStatus === "SUSPENDED" && u.isActive) return false;

      // Text search
      if (search.trim()) {
        const query = search.toLowerCase();
        const name = (u.fullName || "").toLowerCase();
        const email = (u.email || "").toLowerCase();
        const rank = (u.rank || "").toLowerCase();
        return name.includes(query) || email.includes(query) || rank.includes(query);
      }

      return true;
    });
  }, [users, selectedRole, selectedStatus, search]);

  // Summary Metrics
  const metrics = useMemo(() => {
    const total = users.length;
    const crew = users.filter((u) => u.role === "USER").length;
    const captains = users.filter((u) => u.role === "ADMIN").length;
    const superAdmins = users.filter((u) => u.role === "SUPER_ADMIN").length;
    const suspended = users.filter((u) => !u.isActive).length;
    return { total, crew, captains, superAdmins, suspended };
  }, [users]);

  // Quick Action Handlers
  const handleToggleActivate = async (user: AdminUser) => {
    const id = getUserId(user);
    if (!id) return;
    setIsActionPending(true);
    try {
      if (user.isActive) {
        await adminApi.suspendUser(id);
        toast.success(`User ${user.fullName || user.email} suspended.`);
      } else {
        await adminApi.activateUser(id);
        toast.success(`User ${user.fullName || user.email} reactivated.`);
      }
      loadUsers();
      if (activeModalUser && getUserId(activeModalUser) === id) {
        setActiveModalUser({ ...activeModalUser, isActive: !user.isActive });
      }
    } catch (e: any) {
      toast.error(e.response?.data?.message || "Operation failed.");
    } finally {
      setIsActionPending(false);
    }
  };

  const handleUpdateRole = async (user: AdminUser, newRole: string) => {
    const id = getUserId(user);
    if (!id) return;
    setIsActionPending(true);
    try {
      await adminApi.updateRole(id, newRole);
      toast.success(`User role updated to ${newRole}`);
      loadUsers();
      if (activeModalUser && getUserId(activeModalUser) === id) {
        setActiveModalUser({ ...activeModalUser, role: newRole });
      }
    } catch (e: any) {
      toast.error(e.response?.data?.message || "Failed to update role.");
    } finally {
      setIsActionPending(false);
    }
  };

  const handleForceVerify = async (user: AdminUser) => {
    const id = getUserId(user);
    if (!id) return;
    setIsActionPending(true);
    try {
      await adminApi.forceVerifyEmail(id);
      toast.success("User email force verified.");
      loadUsers();
      if (activeModalUser && getUserId(activeModalUser) === id) {
        setActiveModalUser({ ...activeModalUser, isVerified: true });
      }
    } catch (e: any) {
      toast.error(e.response?.data?.message || "Failed to verify email.");
    } finally {
      setIsActionPending(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6 font-sans max-w-7xl mx-auto animate-fade-in pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white p-6 rounded-3xl shadow-xl border border-indigo-800/40 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-300 bg-white/10 px-3 py-1 rounded-full border border-white/10">
            Platform User Management
          </span>
          <h1 className="text-2xl font-extrabold text-white tracking-tight mt-2">
            Global Users Directory
          </h1>
          <p className="text-xs text-indigo-200/80 mt-1">
            Manage officer accounts, authorize captain promotions, inspect profile details, and enforce account safety.
          </p>
        </div>

        <button
          onClick={loadUsers}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl transition cursor-pointer border border-white/15 shrink-0 flex items-center gap-1.5"
        >
          <span>🔄</span>
          <span>Refresh Directory</span>
        </button>
      </div>

      {/* Telemetry Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-white border border-zinc-200 rounded-2xl p-4 flex flex-col justify-between shadow-2xs">
          <span className="text-[10px] font-extrabold uppercase text-zinc-400 font-mono">Total Users</span>
          <span className="text-2xl font-black text-black mt-1">{metrics.total}</span>
        </div>
        <div className="bg-white border border-zinc-200 rounded-2xl p-4 flex flex-col justify-between shadow-2xs">
          <span className="text-[10px] font-extrabold uppercase text-indigo-600 font-mono">Crew Members</span>
          <span className="text-2xl font-black text-indigo-600 mt-1">{metrics.crew}</span>
        </div>
        <div className="bg-white border border-zinc-200 rounded-2xl p-4 flex flex-col justify-between shadow-2xs">
          <span className="text-[10px] font-extrabold uppercase text-sky-600 font-mono font-mono">Captains</span>
          <span className="text-2xl font-black text-sky-600 mt-1">{metrics.captains}</span>
        </div>
        <div className="bg-white border border-zinc-200 rounded-2xl p-4 flex flex-col justify-between shadow-2xs">
          <span className="text-[10px] font-extrabold uppercase text-purple-600 font-mono">Super Admins</span>
          <span className="text-2xl font-black text-purple-600 mt-1">{metrics.superAdmins}</span>
        </div>
        <div className="bg-white border border-zinc-200 rounded-2xl p-4 flex flex-col justify-between shadow-2xs">
          <span className="text-[10px] font-extrabold uppercase text-red-600 font-mono">Suspended / Banned</span>
          <span className="text-2xl font-black text-red-600 mt-1">{metrics.suspended}</span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white border border-zinc-200 rounded-3xl p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full md:w-96">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-zinc-400 text-sm">🔍</span>
          <input
            type="text"
            placeholder="Search by name, email, or rank..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-2xl text-xs text-black placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#0055d4]/20 focus:border-[#0055d4] transition"
          />
        </div>

        {/* Role & Status Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-2xl text-xs font-bold text-black focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Roles</option>
            <option value="USER">Crew & Officers (USER)</option>
            <option value="ADMIN">Captains (ADMIN)</option>
            <option value="SUPER_ADMIN">Super Admins (SUPER_ADMIN)</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-2xl text-xs font-bold text-black focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Account Statuses</option>
            <option value="ACTIVE">Active Users Only</option>
            <option value="SUSPENDED">Suspended / Banned Only</option>
          </select>
        </div>
      </div>

      {/* Users Directory Table */}
      <div className="bg-white border border-zinc-200 rounded-3xl shadow-sm overflow-hidden">
        {isLoading ? (
          <p className="text-xs text-zinc-400 italic py-12 text-center">Loading platform user directory...</p>
        ) : filteredUsers.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-sm font-bold text-zinc-600">No users match your criteria.</p>
            <p className="text-xs text-zinc-400 mt-1">Try clearing your search query or role filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-50 border-b border-zinc-200 text-[10px] font-extrabold text-zinc-400 uppercase tracking-wider font-mono">
                  <th className="py-3.5 px-5">User Officer</th>
                  <th className="py-3.5 px-4">Role & Privilege</th>
                  <th className="py-3.5 px-4">Rank</th>
                  <th className="py-3.5 px-4">Account Status</th>
                  <th className="py-3.5 px-4">Registered Date</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-150 text-xs">
                {filteredUsers.map((u) => {
                  const uId = getUserId(u);
                  const avatar =
                    (u as any).avatarUrl ||
                    (u as any).profileImage ||
                    (u as any).imageAvatar ||
                    (u as any).userAvatar ||
                    (u as any).avatar ||
                    null;
                  const initial = (u.fullName || u.email || "U")[0]?.toUpperCase();

                  return (
                    <tr key={uId} className="hover:bg-zinc-50/80 transition">
                      {/* User Info */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          {avatar ? (
                            <img
                              src={avatar}
                              alt={u.fullName}
                              onClick={() => setPreviewImage(avatar)}
                              className="w-10 h-10 rounded-full object-cover border border-zinc-200 shrink-0 cursor-pointer hover:opacity-90 transition shadow-2xs"
                              title="Click to preview picture"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-black text-xs border border-indigo-200 shrink-0">
                              {initial}
                            </div>
                          )}
                          <div className="flex flex-col">
                            <span className="font-extrabold text-black">{u.fullName || "Unnamed Officer"}</span>
                            <span className="text-[11px] text-zinc-400 font-mono">{u.email}</span>
                          </div>
                        </div>
                      </td>

                      {/* Role Badge */}
                      <td className="py-4 px-4">
                        {u.role === "SUPER_ADMIN" ? (
                          <span className="text-[9px] font-black uppercase tracking-wider bg-purple-100 text-purple-800 px-2.5 py-1 rounded-full border border-purple-300 font-mono">
                            ⚡ Super Admin
                          </span>
                        ) : u.role === "ADMIN" ? (
                          <span className="text-[9px] font-black uppercase tracking-wider bg-sky-100 text-sky-800 px-2.5 py-1 rounded-full border border-sky-300 font-mono">
                            ⚓ Captain
                          </span>
                        ) : (
                          <span className="text-[9px] font-black uppercase tracking-wider bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full border border-indigo-200 font-mono">
                            👤 Crew Member
                          </span>
                        )}
                      </td>

                      {/* Rank */}
                      <td className="py-4 px-4 font-mono text-[11px] text-zinc-600 font-extrabold">
                        {u.rank || "Officer"}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        {u.isActive ? (
                          <span className="text-[9px] font-extrabold uppercase bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-300">
                            ✓ Active
                          </span>
                        ) : (
                          <span className="text-[9px] font-extrabold uppercase bg-red-100 text-red-800 px-2.5 py-0.5 rounded-full border border-red-300">
                            🚫 Suspended
                          </span>
                        )}
                      </td>

                      {/* Registered Date */}
                      <td className="py-4 px-4 font-mono text-[10px] text-zinc-400">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "System"}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setActiveModalUser(u)}
                            className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-[10px] font-bold rounded-xl transition cursor-pointer"
                          >
                            Inspect Profile &rarr;
                          </button>

                          {/* Quick Ban/Unban */}
                          {u.role === "SUPER_ADMIN" ? (
                            <span className="text-[9px] font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-xl border border-purple-200 font-mono">
                              🛡️ Protected
                            </span>
                          ) : (
                            <button
                              onClick={() => handleToggleActivate(u)}
                              disabled={isActionPending}
                              className={`px-3 py-1.5 text-[10px] font-bold rounded-xl transition cursor-pointer border ${
                                u.isActive
                                  ? "bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                                  : "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                              }`}
                            >
                              {u.isActive ? "Ban User" : "Unban"}
                            </button>
                          )}
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

      {/* User Info Detail Modal */}
      {activeModalUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white border border-zinc-200 rounded-3xl w-full max-w-xl p-6 shadow-2xl flex flex-col gap-5 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-zinc-150 pb-4">
              <div className="flex items-center gap-3">
                {(() => {
                  const modalAvatar =
                    userDetail?.profile?.avatarUrl ||
                    (activeModalUser as any).avatarUrl ||
                    (activeModalUser as any).profileImage ||
                    (activeModalUser as any).imageAvatar ||
                    (activeModalUser as any).userAvatar ||
                    (activeModalUser as any).avatar ||
                    null;
                  return modalAvatar ? (
                    <img
                      src={modalAvatar}
                      alt={activeModalUser.fullName}
                      onClick={() => setPreviewImage(modalAvatar)}
                      className="w-14 h-14 rounded-full object-cover border border-zinc-200 shrink-0 shadow-xs cursor-pointer hover:opacity-90 transition"
                      title="Click to preview picture"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-black text-base border border-indigo-200 shrink-0">
                      {(activeModalUser.fullName || activeModalUser.email || "U")[0]?.toUpperCase()}
                    </div>
                  );
                })()}
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-extrabold text-black">
                      {activeModalUser.fullName || "Unnamed Officer"}
                    </h3>
                    <span className="text-[9px] font-black uppercase bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded border border-indigo-200 font-mono">
                      {activeModalUser.rank || "Officer"}
                    </span>
                  </div>
                  <span className="text-xs text-zinc-400 font-mono mt-0.5">{activeModalUser.email}</span>
                </div>
              </div>

              <button
                onClick={() => setActiveModalUser(null)}
                className="p-2 text-zinc-400 hover:text-black rounded-xl hover:bg-zinc-100 transition cursor-pointer text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* Profile Overview Details */}
            {isDetailLoading ? (
              <p className="text-xs text-zinc-400 italic py-8 text-center">Loading comprehensive user telemetry...</p>
            ) : (
              <div className="flex flex-col gap-4">
                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-3 bg-zinc-50 border border-zinc-200 rounded-2xl p-4 text-xs">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[9px] font-bold text-zinc-400 uppercase font-mono">Account ID</span>
                    <span className="font-mono text-zinc-700 truncate">{getUserId(activeModalUser)}</span>
                  </div>

                  <div className="flex flex-col gap-0.5">
                    <span className="text-[9px] font-bold text-zinc-400 uppercase font-mono">Privilege Role</span>
                    <span className="font-extrabold text-indigo-600 uppercase">{activeModalUser.role}</span>
                  </div>

                  <div className="flex flex-col gap-0.5">
                    <span className="text-[9px] font-bold text-zinc-400 uppercase font-mono">Email Verification</span>
                    <span className={activeModalUser.isVerified ? "font-bold text-emerald-600" : "font-bold text-amber-600"}>
                      {activeModalUser.isVerified ? "✓ Verified Email" : "⚠️ Unverified Email"}
                    </span>
                  </div>

                  <div className="flex flex-col gap-0.5">
                    <span className="text-[9px] font-bold text-zinc-400 uppercase font-mono">Account Status</span>
                    <span className={activeModalUser.isActive ? "font-bold text-emerald-600" : "font-bold text-red-600"}>
                      {activeModalUser.isActive ? "✓ Active / Operational" : "🚫 Banned / Suspended"}
                    </span>
                  </div>

                  {(userDetail as any)?.phone && (
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[9px] font-bold text-zinc-400 uppercase font-mono">Phone Number</span>
                      <span className="font-mono text-zinc-700">{(userDetail as any).phone}</span>
                    </div>
                  )}

                  {(userDetail as any)?.company && (
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[9px] font-bold text-zinc-400 uppercase font-mono">Maritime Organization</span>
                      <span className="font-bold text-zinc-800">{(userDetail as any).company}</span>
                    </div>
                  )}
                </div>

                {/* Performance & Activity Statistics */}
                {userDetail?.statistics && (
                  <div className="grid grid-cols-3 gap-2 bg-indigo-50/50 border border-indigo-100 rounded-2xl p-3 text-center">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-extrabold text-indigo-400 uppercase">Assigned Vessels</span>
                      <span className="text-sm font-black text-indigo-700">{userDetail.statistics.vesselCount ?? 0}</span>
                    </div>
                    <div className="flex flex-col border-l border-indigo-100">
                      <span className="text-[9px] font-extrabold text-indigo-400 uppercase">Tasks Completed</span>
                      <span className="text-sm font-black text-emerald-600">{userDetail.statistics.completedTasks ?? 0}</span>
                    </div>
                    <div className="flex flex-col border-l border-indigo-100">
                      <span className="text-[9px] font-extrabold text-indigo-400 uppercase">Defect Issues</span>
                      <span className="text-sm font-black text-amber-600">{userDetail.statistics.issueCount ?? 0}</span>
                    </div>
                  </div>
                )}

                {/* Management Actions Header */}
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-400 border-b border-zinc-150 pb-1 mt-1">
                  Super Admin Account Privilege Controls
                </span>

                {/* Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {/* Promote User -> Captain */}
                  {activeModalUser.role === "USER" && (
                    <button
                      onClick={() => handleUpdateRole(activeModalUser, "ADMIN")}
                      disabled={isActionPending}
                      className="py-2.5 px-3 bg-sky-600 hover:bg-sky-700 text-white text-xs font-extrabold rounded-xl transition cursor-pointer text-center shadow-2xs"
                    >
                      ⚓ Promote User to Captain
                    </button>
                  )}

                  {/* Promote Captain -> Super Admin */}
                  {activeModalUser.role === "ADMIN" && (
                    <button
                      onClick={() => handleUpdateRole(activeModalUser, "SUPER_ADMIN")}
                      disabled={isActionPending}
                      className="py-2.5 px-3 bg-purple-600 hover:bg-purple-700 text-white text-xs font-extrabold rounded-xl transition cursor-pointer text-center shadow-2xs"
                    >
                      ⚡ Promote Captain to Super Admin
                    </button>
                  )}

                  {/* Demote to Crew */}
                  {activeModalUser.role !== "USER" && (
                    <button
                      onClick={() => handleUpdateRole(activeModalUser, "USER")}
                      disabled={isActionPending}
                      className="py-2.5 px-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-bold rounded-xl transition cursor-pointer text-center"
                    >
                      👤 Demote to Crew Member
                    </button>
                  )}

                  {/* Ban / Reactivate Toggle */}
                  {activeModalUser.role === "SUPER_ADMIN" ? (
                    <div className="py-2.5 px-3 bg-purple-50 border border-purple-200 text-purple-800 text-xs font-bold rounded-xl text-center flex items-center justify-center gap-1.5">
                      <span>🛡️</span>
                      <span>Super Admin Account Protected</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleToggleActivate(activeModalUser)}
                      disabled={isActionPending}
                      className={`py-2.5 px-3 text-xs font-extrabold rounded-xl transition cursor-pointer text-center border ${
                        activeModalUser.isActive
                          ? "bg-red-50 hover:bg-red-100 text-red-700 border-red-200"
                          : "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200"
                      }`}
                    >
                      {activeModalUser.isActive ? "🚫 Ban / Suspend Account" : "✓ Reactivate Account"}
                    </button>
                  )}

                  {/* Force Verify Email */}
                  {!activeModalUser.isVerified && (
                    <button
                      onClick={() => handleForceVerify(activeModalUser)}
                      disabled={isActionPending}
                      className="py-2.5 px-3 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-extrabold rounded-xl transition cursor-pointer text-center"
                    >
                      ✉️ Force Verify Email
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Modal Footer */}
            <div className="border-t border-zinc-150 pt-3">
              <button
                onClick={() => setActiveModalUser(null)}
                className="w-full py-2.5 bg-zinc-100 hover:bg-zinc-200 text-xs font-bold text-black rounded-xl transition cursor-pointer"
              >
                Close User Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Preview Lightbox Modal */}
      <ImagePreviewModal
        isOpen={!!previewImage}
        src={previewImage}
        onClose={() => setPreviewImage(null)}
      />
    </div>
  );
};

export default UsersManagementPage;
