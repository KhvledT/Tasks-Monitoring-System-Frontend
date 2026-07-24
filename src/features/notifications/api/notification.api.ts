import { apiClient } from "../../../lib/axios";

export interface NotificationItem {
  _id: string;
  userId: string;
  vesselId?: string;
  title: string;
  body: string;
  type: "CREW_JOIN" | "CREW_LEAVE" | "DEFECT_ALERT" | "WATCH_HANDOVER" | "SYSTEM";
  severity: "INFO" | "WARNING" | "CRITICAL";
  isRead: boolean;
  linkPath?: string;
  metadata?: Record<string, any>;
  createdAt: string;
}

export interface GetNotificationsResponse {
  message: string;
  data: {
    docs: NotificationItem[];
    totalDocs: number;
    limit: number;
    page: number;
    totalPages: number;
    unreadCount: number;
  };
}

export const getNotifications = async (params?: { page?: number; limit?: number; unreadOnly?: boolean; type?: string }) => {
  const res = await apiClient.get<GetNotificationsResponse>("/notification", { params });
  return res.data.data;
};

export const getUnreadCount = async () => {
  const res = await apiClient.get<{ data: { unreadCount: number } }>("/notification/unread-count");
  return res.data.data.unreadCount;
};

export const markAsRead = async (id: string) => {
  const res = await apiClient.patch(`/notification/${id}/read`);
  return res.data;
};

export const markAllAsRead = async () => {
  const res = await apiClient.patch("/notification/read-all");
  return res.data;
};

export const deleteNotification = async (id: string) => {
  const res = await apiClient.delete(`/notification/${id}`);
  return res.data;
};
