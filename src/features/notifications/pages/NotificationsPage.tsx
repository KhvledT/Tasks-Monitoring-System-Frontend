import React, { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  type NotificationItem,
} from "../api/notification.api";
import { useSocket } from "../../../providers/SocketProvider";

export const NotificationsPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { socket } = useSocket();

  // Fetch all user notifications stream
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => getNotifications({ page: 1, limit: 100 }),
    refetchInterval: 15000,
  });

  // Real-time online socket listener
  useEffect(() => {
    if (!socket) return;

    const handleNewNotification = (notif: NotificationItem) => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({
        queryKey: ["unread-notifications-count"],
      });

      toast.custom(
        (t) => (
          <div
            onClick={() => {
              toast.dismiss(t.id);
              if (notif.linkPath) navigate(notif.linkPath);
            }}
            className={`max-w-md w-full bg-white shadow-xl rounded-2xl border p-4 cursor-pointer flex items-start gap-3 transition hover:scale-[1.02] ${
              notif.severity === "CRITICAL"
                ? "border-red-300 bg-red-50/50"
                : notif.severity === "WARNING"
                  ? "border-amber-300 bg-amber-50/50"
                  : "border-blue-200 bg-blue-50/40"
            }`}
          >
            <span
              className={`w-3 h-3 rounded-full mt-1 shrink-0 ${
                notif.severity === "CRITICAL"
                  ? "bg-red-600 animate-pulse"
                  : notif.severity === "WARNING"
                    ? "bg-amber-500"
                    : "bg-blue-500"
              }`}
            />
            <div className="flex-1">
              <h4 className="text-xs font-extrabold text-black">
                {notif.title}
              </h4>
              <p className="text-xs text-zinc-600 mt-0.5">{notif.body}</p>
              <span className="text-[9px] font-bold text-primary mt-1.5 block">
                Tap to view details →
              </span>
            </div>
          </div>
        ),
        { duration: 5000 },
      );
    };

    socket.on("new_notification", handleNewNotification);
    socket.on("unread_count_updated", () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({
        queryKey: ["unread-notifications-count"],
      });
    });

    return () => {
      socket.off("new_notification", handleNewNotification);
      socket.off("unread_count_updated");
    };
  }, [socket, navigate, queryClient]);

  // Mutations
  const markReadMutation = useMutation({
    mutationFn: markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({
        queryKey: ["unread-notifications-count"],
      });
    },
  });

  const markAllReadMutation = useMutation({
    mutationFn: markAllAsRead,
    onSuccess: () => {
      toast.success("All notifications marked as read.");
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({
        queryKey: ["unread-notifications-count"],
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({
        queryKey: ["unread-notifications-count"],
      });
    },
  });

  const handleCardClick = (n: NotificationItem) => {
    if (!n.isRead) {
      markReadMutation.mutate(n._id);
    }
    if (n.linkPath) {
      navigate(n.linkPath);
    }
  };

  const notifications = data?.docs || [];
  const unreadCount = data?.unreadCount || 0;

  return (
    <div className="flex flex-col gap-6 p-6 font-sans max-w-4xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-black tracking-tight">
              Real-Time Notifications
            </h1>
            {unreadCount > 0 && (
              <span className="text-xs font-extrabold bg-red-100 text-red-800 border border-red-200 px-2.5 py-0.5 rounded-full">
                {unreadCount} Unread
              </span>
            )}
          </div>
          <p className="text-xs text-zinc-500 mt-1">
            Live operational alert stream while online. All events appear
            chronologically.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => markAllReadMutation.mutate()}
            disabled={markAllReadMutation.isPending || unreadCount === 0}
            className="px-3.5 py-2 bg-white border border-zinc-200 hover:bg-zinc-50 text-xs font-bold text-black rounded-xl transition cursor-pointer disabled:opacity-40"
          >
            ✓ Mark All as Read
          </button>
          <button
            onClick={() => refetch()}
            className="px-3 py-2 bg-primary hover:bg-[#003fa3] text-white text-xs font-bold rounded-xl transition cursor-pointer"
          >
            🔄 Refresh Stream
          </button>
        </div>
      </div>

      {/* Real-time Online Notification Stream */}
      <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-xs text-zinc-400 font-semibold animate-pulse">
            Connecting to real-time notification stream...
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-16 text-center flex flex-col items-center justify-center gap-2">
            <span className="text-3xl">🔔</span>
            <h3 className="text-sm font-bold text-black">
              No Online Alerts Received
            </h3>
            <p className="text-xs text-zinc-400 max-w-sm">
              You are all caught up! Operational alerts, watch shifts, and crew
              notifications will appear here in real time.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-100">
            {notifications.map((n: NotificationItem) => {
              const isCritical = n.severity === "CRITICAL";
              const isWarning = n.severity === "WARNING";

              return (
                <div
                  key={n._id}
                  onClick={() => handleCardClick(n)}
                  className={`p-4 flex items-start justify-between gap-4 transition cursor-pointer hover:bg-zinc-50/80 ${
                    !n.isRead ? "bg-blue-50/30" : ""
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    <span
                      className={`w-3 h-3 rounded-full mt-1 shrink-0 ${
                        isCritical
                          ? "bg-red-600 animate-pulse"
                          : isWarning
                            ? "bg-amber-500"
                            : "bg-blue-500"
                      }`}
                    />
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        {!n.isRead && (
                          <span className="text-[9px] font-extrabold uppercase bg-blue-100 text-blue-800 px-2 py-0.5 rounded border border-blue-200">
                            NEW
                          </span>
                        )}
                        <h4 className="text-sm font-bold text-black">
                          {n.title}
                        </h4>
                      </div>
                      <p className="text-xs text-zinc-600 leading-relaxed">
                        {n.body}
                      </p>
                      {n.linkPath && (
                        <span className="text-[10px] font-bold text-primary mt-1 hover:underline">
                          Inspect details →
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] text-zinc-400 font-mono">
                      {new Date(n.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteMutation.mutate(n._id);
                      }}
                      className="p-1 text-zinc-400 hover:text-red-600 transition cursor-pointer"
                      title="Dismiss Notification"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
