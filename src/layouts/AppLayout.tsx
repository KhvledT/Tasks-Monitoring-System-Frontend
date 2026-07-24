import React, { useEffect } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useAuth } from "../shared/hooks/useAuth";
import { useActiveVessel } from "../shared/hooks/useActiveVessel";
import { NAVIGATION_ITEMS } from "../config/navigation";
import { ROUTES } from "../constants/routes";
import { VesselSelector } from "../features/vessel";
import { useSocket } from "../providers/SocketProvider";
import { getUnreadCount } from "../features/notifications/api/notification.api";

export const AppLayout: React.FC = () => {
  const { logout, user } = useAuth();
  const { activeVessel, isArchiveMode, setViewedVessel, isOperationalActive, vesselName, vesselStatus, hasRequestedLeave, isOffboarded } = useActiveVessel();
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { socket } = useSocket();

  // Fetch unread notification count
  const { data: unreadCount = 0 } = useQuery({
    queryKey: ["unread-notifications-count"],
    queryFn: getUnreadCount,
    enabled: !!user && user.role !== "SUPER_ADMIN",
    refetchInterval: 30000,
  });

  // Real-time socket event handler
  useEffect(() => {
    if (!socket) return;

    const handleNewNotif = (notif: any) => {
      queryClient.invalidateQueries({ queryKey: ["unread-notifications-count"] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });

      toast.custom(
        (t) => (
          <div
            onClick={() => {
              toast.dismiss(t.id);
              if (notif.linkPath) navigate(notif.linkPath);
            }}
            className="max-w-md w-full bg-white shadow-xl rounded-2xl border border-blue-200 p-4 cursor-pointer flex items-start gap-3 transition hover:scale-[1.02]"
          >
            <span className="w-3 h-3 rounded-full bg-primary mt-1 shrink-0 animate-pulse" />
            <div className="flex-1">
              <h4 className="text-xs font-extrabold text-black">{notif.title}</h4>
              <p className="text-xs text-zinc-600 mt-0.5">{notif.body}</p>
              <span className="text-[9px] font-bold text-primary mt-1 block">
                Tap to view →
              </span>
            </div>
          </div>
        ),
        { duration: 6000 }
      );
    };

    const handleLeaveApproved = (data: any) => {
      try {
        if (data?.vesselId) {
          localStorage.removeItem(`mtms_pending_leave_${data.vesselId}`);
        }
        localStorage.removeItem("mtms_has_pending_leave");
      } catch (e) {}
      queryClient.invalidateQueries({ queryKey: ["vessels"] });
      queryClient.invalidateQueries({ queryKey: ["user-vessels"] });
      queryClient.invalidateQueries({ queryKey: ["unread-notifications-count"] });
      toast.success(
        `Your leave request for ${data?.vesselName || "VIP vessel"} was approved and processed.`
      );
    };

    const handleLeaveRejected = (data: any) => {
      try {
        if (data?.vesselId) {
          localStorage.removeItem(`mtms_pending_leave_${data.vesselId}`);
        }
        localStorage.removeItem("mtms_has_pending_leave");
      } catch (e) {}
      queryClient.invalidateQueries({ queryKey: ["vessels"] });
      queryClient.invalidateQueries({ queryKey: ["user-vessels"] });
      queryClient.invalidateQueries({ queryKey: ["unread-notifications-count"] });
      toast.error(
        `Your leave request for ${data?.vesselName || "VIP vessel"} was refused by the Captain.`
      );
    };

    socket.on("new_notification", handleNewNotif);
    socket.on("crew:leave_approved", handleLeaveApproved);
    socket.on("crew:leave_rejected", handleLeaveRejected);
    socket.on("unread_count_updated", () => {
      queryClient.invalidateQueries({ queryKey: ["unread-notifications-count"] });
    });

    return () => {
      socket.off("new_notification", handleNewNotif);
      socket.off("crew:leave_approved", handleLeaveApproved);
      socket.off("crew:leave_rejected", handleLeaveRejected);
      socket.off("unread_count_updated");
    };
  }, [socket, queryClient, navigate]);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "SelectVessel":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.8}
            stroke="currentColor"
            className="w-4.5 h-4.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3"
            />
          </svg>
        );
      case "Home":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.8}
            stroke="currentColor"
            className="w-4.5 h-4.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
            />
          </svg>
        );
      case "Dashboard":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.8}
            stroke="currentColor"
            className="w-4.5 h-4.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
            />
          </svg>
        );
      case "Checklist":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.8}
            stroke="currentColor"
            className="w-4.5 h-4.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.03 0 1.9.693 2.166 1.638m-7.377 0A48.536 48.536 0 0 1 12 3c1.2 0 2.392.049 3.57.145m-7.377 0a48.474 48.474 0 0 0-1.123.08A2.25 2.25 0 0 0 4.5 6.108V16.5A2.25 2.25 0 0 0 6.75 18.75h3.75M8.25 21h8.25"
            />
          </svg>
        );
      case "Warning":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.8}
            stroke="currentColor"
            className="w-4.5 h-4.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
            />
          </svg>
        );
      case "History":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.8}
            stroke="currentColor"
            className="w-4.5 h-4.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
        );
      case "Profile":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.8}
            stroke="currentColor"
            className="w-4.5 h-4.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
            />
          </svg>
        );
      case "Reports":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.8}
            stroke="currentColor"
            className="w-4.5 h-4.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m.75 12 3 3m0 0 3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return "O";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  // Filter navigation items by user role, vessel mode, and read-only status
  const isReadOnlyVesselView = !isOperationalActive || isArchiveMode || hasRequestedLeave || isOffboarded;

  const filteredNavItems = NAVIGATION_ITEMS.filter((item) => {
    if (!user) return false;
    
    // Check role restriction
    if (item.allowedRoles && !item.allowedRoles.includes(user.role)) {
      return false;
    }

    // Check vessel mode restriction if active vessel exists
    if (item.vesselModes && activeVessel?.vesselMode) {
      if (!item.vesselModes.includes(activeVessel.vesselMode as any)) {
        return false;
      }
    }

    // When viewing a read-only / inactive / archive / leaved / offboarded vessel:
    // Hide operational action pages (Checklists, Issues, Reports)
    if (isReadOnlyVesselView) {
      const hiddenInReadOnly = [ROUTES.CHECKLISTS, ROUTES.ISSUES, ROUTES.REPORTS];
      if (hiddenInReadOnly.includes(item.path as any)) {
        return false;
      }
    }

    return true;
  });

  return (
    <div className="h-screen w-screen overflow-hidden bg-bg-light text-text-dark flex flex-col md:flex-row font-sans">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 h-screen border-r border-border-subtle bg-white p-5 shrink-0 justify-between overflow-y-auto z-30">
        <div className="flex flex-col gap-6">
          {/* Sidebar Header Brand */}
          <div className="flex items-center gap-3 px-2">
            <span className="font-extrabold tracking-tight text-xl text-[#0055d4]">
              Maritime Monitor
            </span>
          </div>
          <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider px-2 -mt-4.5 block">
            Vessel Ops Center
          </span>

          {activeVessel && (
            <div className="mb-2 flex flex-col gap-2 px-2">
              <p className="text-[10px] uppercase font-bold text-zinc-450 tracking-wider">
                Vessel Workspace
              </p>
              <VesselSelector />
            </div>
          )}

          <nav className="flex flex-col gap-1">
            {filteredNavItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  aria-current={isActive ? "page" : undefined}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition ${
                    isActive
                      ? "bg-sky-950/40 text-primary border border-primary/10"
                      : "text-zinc-500 hover:text-black hover:bg-zinc-50 border border-transparent"
                  }`}
                >
                  {getIcon(item.icon)}
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer User profile */}
        <div className="border-t border-border-subtle pt-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5 truncate">
            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.fullName}
                className="w-9 h-9 rounded-full object-cover border border-zinc-200"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-blue-50 border border-primary/25 flex items-center justify-center font-bold text-xs text-primary shadow-inner">
                {getInitials(user?.fullName)}
              </div>
            )}
            <div className="truncate flex flex-col gap-0.5">
              <p className="text-xs font-bold text-black truncate">
                {user?.fullName || "Unnamed"}
              </p>
              <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-wide truncate">
                {user?.rank || "Officer"}
              </p>
            </div>
          </div>
          <button
            onClick={logout}
            className="p-1.5 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
            title="Sign Out"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.8}
              stroke="currentColor"
              className="w-4.5 h-4.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75"
              />
            </svg>
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden border-b border-border-subtle bg-white px-5 py-4 flex items-center justify-between shrink-0">
        <div className="flex flex-col">
          <span className="font-extrabold tracking-tight text-[#0055d4] text-base">
            Maritime Monitor
          </span>
          <span className="text-[8px] text-zinc-400 font-bold uppercase tracking-wider">
            Vessel Ops Center
          </span>
        </div>
        <div className="flex items-center gap-3">
          {activeVessel && (
            <div className="max-w-[140px]">
              <VesselSelector />
            </div>
          )}
          <button onClick={logout} className="text-xs text-red-500 font-bold">
            Sign Out
          </button>
        </div>
      </header>

      {/* Right Column Layout Container */}
      <div className="flex-1 flex flex-col h-screen min-w-0 overflow-hidden relative bg-bg-light">
        {/* Top Content Navigation Bar (Permanently Fixed Top Navbar & Vessel Context Control) */}
        <header className="hidden md:flex items-center justify-between bg-white border-b border-zinc-200 px-8 py-3 shrink-0 z-50 select-none shadow-2xs">
          {/* Active Vessel Indicator & Quick Actions */}
          <div className="flex items-center gap-3">
            {activeVessel ? (
              <div className="flex items-center gap-2 bg-emerald-50/80 border border-emerald-250 px-3 py-1.5 rounded-xl">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-sm font-extrabold text-[#0055d4] tracking-tight">
                  ✓ {activeVessel.name}
                </span>
                <span className="text-[9px] font-extrabold uppercase bg-blue-50 text-blue-800 px-2 py-0.5 rounded border border-blue-200">
                  {activeVessel.vesselMode || "Personal"} &bull; {activeVessel.type || "Standard"}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2 bg-amber-50 border border-amber-300 px-3.5 py-1.5 rounded-xl shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <span className="text-xs font-extrabold text-amber-950 tracking-tight">
                  ⚠️ No Active Vessel Context (Off-Contract)
                </span>
              </div>
            )}

            {/* Persistent Top Navbar Actions: Select Vessel & Open Dashboard */}
            <Link
              to="/select-vessel"
              className="px-3.5 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-extrabold text-xs rounded-xl border border-zinc-300 transition flex items-center gap-1.5 cursor-pointer"
            >
              <span>⚓ Select Vessel</span>
            </Link>

            <Link
              to="/dashboard"
              className="px-3.5 py-1.5 bg-[#0055d4] hover:bg-[#003fa3] text-white font-extrabold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
            >
              <span>📊 Open Dashboard</span>
            </Link>
          </div>

          <div className="flex items-center gap-4 text-zinc-500">
            {/* Clock icon linked to History */}
            <Link
              to="/history"
              className="p-1 hover:bg-zinc-50 rounded-lg cursor-pointer transition text-zinc-500"
              title="History Logbook Timeline"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.8}
                stroke="currentColor"
                className="w-4.5 h-4.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            </Link>
            {/* Alert / Notification bell with functional dropdown */}
            <div className="relative">
              <button
                onClick={() => navigate(ROUTES.NOTIFICATIONS)}
                className="p-1.5 text-zinc-500 hover:bg-zinc-50 rounded-lg cursor-pointer transition focus:outline-none flex items-center relative"
                title="Notifications Center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.8}
                  stroke="currentColor"
                  className="w-4.5 h-4.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
                  />
                </svg>
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[9px] font-extrabold px-1.5 py-0.2 rounded-full border border-white animate-pulse">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </button>
            </div>
            {/* Small avatar container linked to Profile */}
            <Link
              to="/profile"
              className="w-7 h-7 rounded-full bg-blue-50 border border-primary/20 flex items-center justify-center font-bold text-[10px] text-primary shadow-inner cursor-pointer overflow-hidden shrink-0"
              title="Officer Profile Settings"
            >
              {user?.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.fullName || 'User'} className="w-full h-full object-cover" />
              ) : (
                getInitials(user?.fullName)
              )}
            </Link>
          </div>
        </header>

        {/* Scrollable Page Content Container */}
        <main className="flex-1 overflow-y-auto min-h-0 relative pb-20 md:pb-8 bg-bg-light">
          <div className="p-6 md:p-8 flex-1 flex flex-col max-w-7xl w-full mx-auto animate-fade-in">
          {!isOperationalActive && !isArchiveMode && (
            <div className="bg-amber-50 border border-amber-200 p-4.5 rounded-2xl flex items-center justify-between gap-4 mb-6 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 bg-amber-500 rounded-full animate-pulse shrink-0" />
                <p className="text-xs font-semibold text-amber-900 leading-relaxed">
                  {isOffboarded ? (
                    <>
                      <strong>Offboarded VIP Vessel ({vesselName} — Read-Only Mode)</strong>: You are viewing historical logbook data for a vessel you previously served on. All operational watchkeeping actions are disabled.
                    </>
                  ) : hasRequestedLeave ? (
                    <>
                      <strong>Leave Request Pending ({vesselName} — Read-Only Mode)</strong>: You have submitted a leave request awaiting Captain replacement. Operational watchkeeping shifts and task executions are disabled. You remain in <strong>Read-Only Mode</strong> to inspect past logbook history & compliance reports.
                    </>
                  ) : (
                    <>
                      <strong>Read-Only Workspace ({vesselName} — Status: {vesselStatus || "Inactive"})</strong>: Operational actions (Watchkeeping shifts, Task executions, Defect creation) are disabled. Only <strong>Logbook History</strong> & <strong>Compliance Reports</strong> are accessible.
                    </>
                  )}
                </p>
              </div>
            </div>
          )}
          {isArchiveMode && (
            <div className="bg-amber-50 border border-amber-250 p-4.5 rounded-xl flex items-center justify-between gap-4 mb-6 shadow-sm">
              <div className="flex items-center gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-5 h-5 text-amber-600 shrink-0"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                  />
                </svg>
                <p className="text-xs font-semibold text-amber-800 leading-relaxed">
                  You are viewing historical data for this vessel. All actions
                  are in read-only mode.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setViewedVessel(activeVessel)}
                className="px-3.5 py-1.5 bg-amber-100 border border-amber-250 hover:bg-amber-200 text-amber-800 text-[10px] font-extrabold rounded-xl uppercase tracking-wider transition active:scale-[0.98] cursor-pointer"
              >
                Return to Active Vessel
              </button>
            </div>
          )}
          <Outlet />
        </div>
      </main>
    </div>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t border-border-subtle bg-white/90 backdrop-blur-md px-4 py-2 flex items-center justify-around z-50">
        {NAVIGATION_ITEMS.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-1 py-1 px-3 transition ${
                isActive ? "text-primary font-bold" : "text-text-muted"
              }`}
            >
              {getIcon(item.icon)}
              <span className="text-[9px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};
export default AppLayout;
