import { apiClient } from '../../../lib/axios';

export interface CrewMember {
  id: string;
  vesselId: string;
  userId: string;
  rank: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  user?: {
    fullName: string;
    email: string;
    avatarUrl?: string | null;
    isActive: boolean;
  };
}

export interface JoinRequest {
  id: string;
  _id?: string;
  vesselId: string;
  userId: string;
  rank: string;
  requestedRank?: string;
  status: 'PENDING';
  createdAt: string;
  user?: {
    fullName: string;
    email: string;
    avatarUrl?: string | null;
    rank?: string;
  };
}

export const crewApi = {
  listCrew: async (vesselId: string): Promise<CrewMember[]> => {
    const response = await apiClient.get<{ success: boolean; result: CrewMember[] }>(
      `/vessel/${vesselId}/crew`
    );
    return response.data.result;
  },

  listJoinRequests: async (vesselId: string): Promise<JoinRequest[]> => {
    const response = await apiClient.get<{ success: boolean; result: JoinRequest[] }>(
      `/vessel/${vesselId}/requests`
    );
    return response.data.result;
  },

  approveJoinRequest: async (vesselId: string, requestId: string, rank: string): Promise<void> => {
    await apiClient.patch(`/vessel/${vesselId}/requests/${requestId}/approve`, { rank });
  },

  rejectJoinRequest: async (vesselId: string, requestId: string): Promise<void> => {
    await apiClient.patch(`/vessel/${vesselId}/requests/${requestId}/reject`);
  },

  changeCrewRank: async (vesselId: string, crewId: string, rank: string): Promise<void> => {
    await apiClient.patch(`/vessel/${vesselId}/crew/${crewId}/rank`, { rank });
  },

  removeCrewMember: async (vesselId: string, crewId: string): Promise<void> => {
    await apiClient.delete(`/vessel/${vesselId}/crew/${crewId}`);
  },

  getCrewMemberDetails: async (vesselId: string, crewId: string): Promise<{
    member: CrewMember;
    completedTasks: Array<{ id: string; title: string; categoryName: string; taskGroup: string; completedAt: string; status: string; notes?: string }>;
    pendingTasks: Array<{ id: string; title: string; categoryName: string; taskGroup: string; status: string; notes?: string }>;
    issues: Array<{ id: string; title: string; description: string; severity: string; status: string; createdAt: string; imageUrl?: string | null }>;
  }> => {
    const response = await apiClient.get(`/vessel/${vesselId}/crew/${crewId}/details`);
    return response.data.result;
  },
};
