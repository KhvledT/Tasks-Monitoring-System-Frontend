import { apiClient } from '../../../lib/axios';
import type {
  IssueListResponse,
  CreateIssueRequest,
} from '../types/issue.types';

export const issueApi = {
  getIssues: async (vesselId: string): Promise<IssueListResponse> => {
    const response = await apiClient.get<any>('/issue/list', {
      params: { vesselId },
    });
    const data = response.data;
    if (data?.result && typeof data.result === 'object' && Array.isArray(data.result.docs)) {
      return {
        ...data,
        result: data.result.docs,
      } as unknown as IssueListResponse;
    }
    return data;
  },

  createIssue: async (data: CreateIssueRequest): Promise<any> => {
    const response = await apiClient.post('/issue/create', data);
    return response.data;
  },

  deleteIssue: async (issueId: string): Promise<any> => {
    const response = await apiClient.delete(`/issue/${issueId}/delete`);
    return response.data;
  },

  updateIssue: async (issueId: string, data: { description?: string; note?: string; severity?: string; status?: string; resolutionNotes?: string }): Promise<any> => {
    const response = await apiClient.patch(`/issue/${issueId}/update`, data);
    return response.data;
  },

  getChecklistRecords: async (vesselId: string, date: string): Promise<any> => {
    const response = await apiClient.get('/task-record/list', {
      params: { vesselId, date },
    });
    return response.data;
  },
};

export default issueApi;
