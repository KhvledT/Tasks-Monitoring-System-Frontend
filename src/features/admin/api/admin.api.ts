import { apiClient } from '../../../lib/axios';

export interface AdminUserDetail {
  id: string;
  fullName: string;
  email: string;
  role: string;
  rank: string;
  isVerified: boolean;
  isActive: boolean;
  activeVesselId?: string;
  phone?: string;
  company?: string;
  profile?: {
    id?: string;
    fullName?: string;
    email?: string;
    avatarUrl?: string | null;
    rank?: string;
    phone?: string;
    company?: string;
  };
  statistics: {
    vesselCount: number;
    completedTasks: number;
    issueCount: number;
  };
}

export interface AdminUserListItem {
  _id: string;
  id?: string;
  fullName: string;
  email: string;
  role: string;
  rank: string;
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
}

export type AdminUser = AdminUserListItem;

export interface FleetSummary {
  totalVessels: number;
  totalCaptains: number;
  totalCrew: number;
  totalTasksCompleted: number;
  totalIssues: number;
}

export const adminApi = {
  listUsers: async (params?: any): Promise<{ items: AdminUserListItem[]; pagination: { total: number; page: number; limit: number; pages: number } }> => {
    const response = await apiClient.get<{
      success: boolean;
      result: { items: AdminUserListItem[]; pagination: { total: number; page: number; limit: number; pages: number } };
    }>('/admin/users', { params });
    return response.data.result;
  },

  getUserDetails: async (id: string): Promise<AdminUserDetail> => {
    const response = await apiClient.get<{ success: boolean; result: AdminUserDetail }>(
      `/admin/users/${id}`
    );
    return response.data.result;
  },

  activateUser: async (id: string): Promise<void> => {
    await apiClient.patch(`/admin/users/${id}/activate`);
  },

  suspendUser: async (id: string): Promise<void> => {
    await apiClient.patch(`/admin/users/${id}/suspend`);
  },

  forceVerifyEmail: async (id: string): Promise<void> => {
    await apiClient.patch(`/admin/users/${id}/verify-email`);
  },

  resetPassword: async (id: string): Promise<void> => {
    await apiClient.post(`/admin/users/${id}/reset-password`);
  },

  updateRole: async (id: string, role: string): Promise<void> => {
    await apiClient.patch(`/admin/users/${id}/role`, { role });
  },

  listCaptains: async (params?: any): Promise<{ items: AdminUserListItem[]; pagination: { total: number; page: number; limit: number; pages: number } }> => {
    const response = await apiClient.get<{
      success: boolean;
      result: { items: AdminUserListItem[]; pagination: { total: number; page: number; limit: number; pages: number } };
    }>('/admin/captains', { params });
    return response.data.result;
  },

  assignCaptainToVessel: async (vesselId: string, captainId: string, reason?: string): Promise<void> => {
    await apiClient.patch(`/admin/vessels/${vesselId}/assign-captain`, { captainId, reason });
  },

  getFleetSummary: async (): Promise<FleetSummary> => {
    const response = await apiClient.get<{ success: boolean; result: FleetSummary }>(
      '/dashboard/fleet'
    );
    return response.data.result;
  },
};
