import { apiClient } from '../../../lib/axios';
import type {
  ChecklistListResponse,
  CompleteTaskRequest,
  PostponeTaskRequest,
} from '../types/checklist.types';

export const checklistApi = {
  getChecklistRecords: async (vesselId: string, date: string): Promise<ChecklistListResponse> => {
    const response = await apiClient.get<ChecklistListResponse>('/task-record/list', {
      params: { vesselId, date },
    });
    return response.data;
  },

  completeTask: async (recordId: string, data: CompleteTaskRequest): Promise<any> => {
    const response = await apiClient.patch(`/task-record/${recordId}/complete`, data);
    return response.data;
  },

  postponeTask: async (recordId: string, data: PostponeTaskRequest): Promise<any> => {
    const response = await apiClient.patch(`/task-record/${recordId}/postpone`, data);
    return response.data;
  },
};

export default checklistApi;
