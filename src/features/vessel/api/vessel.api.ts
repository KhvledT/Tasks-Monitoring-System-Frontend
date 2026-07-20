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

  deleteVessel: async (vesselId: string): Promise<any> => {
    const response = await apiClient.delete(`/vessel/${vesselId}/delete`);
    return response.data;
  },
};
export default vesselApi;
