import { apiClient } from '../../../lib/axios';
import type {
  VesselListResponse,
  CreateVesselResponse,
  CreateVesselRequest,
  ActivateVesselResponse,
} from '../types/vessel.types';

export const vesselApi = {
  getVessels: async (): Promise<VesselListResponse> => {
    const response = await apiClient.get<any>('/vessel/list');
    const data = response.data;
    
    // Support backend pagination wrapper (result.docs) transparently
    if (data?.result && typeof data.result === 'object' && Array.isArray(data.result.docs)) {
      return {
        ...data,
        result: data.result.docs,
      };
    }
    
    return data;
  },

  createVessel: async (data: CreateVesselRequest): Promise<CreateVesselResponse> => {
    const response = await apiClient.post<CreateVesselResponse>('/vessel/create', data);
    return response.data;
  },

  activateVessel: async (vesselId: string): Promise<ActivateVesselResponse> => {
    const response = await apiClient.patch<ActivateVesselResponse>(`/vessel/${vesselId}/set-active`);
    return response.data;
  },

  updateVessel: async (vesselId: string, data: Partial<CreateVesselRequest>): Promise<any> => {
    const response = await apiClient.patch(`/vessel/${vesselId}/update`, data);
    return response.data;
  },

  deactivateVessel: async (): Promise<any> => {
    const response = await apiClient.patch('/vessel/deactivate');
    return response.data;
  },

  deleteVessel: async (vesselId: string): Promise<any> => {
    const response = await apiClient.delete(`/vessel/${vesselId}/delete`);
    return response.data;
  },

  joinVessel: async (data: { inviteCode: string }): Promise<any> => {
    const response = await apiClient.post('/vessel/join', data);
    return response.data;
  },

  requestLeaveVessel: async (vesselId: string): Promise<any> => {
    const response = await apiClient.post(`/vessel/${vesselId}/request-leave`);
    try {
      localStorage.setItem(`mtms_pending_leave_${vesselId}`, "true");
      localStorage.setItem("mtms_has_pending_leave", "true");
    } catch (e) {}
    return response.data;
  },

  listLeaveRequests: async (vesselId: string): Promise<any> => {
    const response = await apiClient.get(`/vessel/${vesselId}/leave-requests`);
    return response.data?.result || [];
  },

  rejectLeaveRequest: async (vesselId: string, crewId: string): Promise<any> => {
    const response = await apiClient.patch(`/vessel/${vesselId}/crew/${crewId}/reject-leave`);
    return response.data;
  },

  replaceCrewMember: async (
    vesselId: string,
    crewId: string,
    data: { replacementUserId?: string; replacementRequestId?: string; newRank?: string }
  ): Promise<any> => {
    const response = await apiClient.post(`/vessel/${vesselId}/crew/${crewId}/replace`, data);
    return response.data;
  },
};
export default vesselApi;
