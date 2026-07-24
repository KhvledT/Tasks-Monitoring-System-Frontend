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

  createCustomTask: async (vesselId: string, data: { categoryId?: string; categoryName?: string; taskGroup?: string; title: string; description?: string }): Promise<any> => {
    const response = await apiClient.post(`/task/${vesselId}/create`, data);
    return response.data.result;
  },

  updateCustomTask: async (vesselId: string, taskId: string, data: { title?: string; description?: string }): Promise<any> => {
    const response = await apiClient.patch(`/task/${vesselId}/${taskId}/update`, data);
    return response.data.result;
  },

  deleteCustomTask: async (vesselId: string, taskId: string): Promise<any> => {
    const response = await apiClient.delete(`/task/${vesselId}/${taskId}/delete`);
    return response.data;
  },

  getTasks: async (vesselId: string, taskGroup: string): Promise<any> => {
    const response = await apiClient.get(`/task/${vesselId}/list`, {
      params: { taskGroup },
    });
    return response.data.result;
  },
};

export default checklistApi;
