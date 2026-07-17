import { apiClient } from '../../../lib/axios';
import type {
  IssueListResponse,
  CreateIssueRequest,
} from '../types/issue.types';

export const issueApi = {
  getIssues: async (vesselId: string): Promise<IssueListResponse> => {
    const response = await apiClient.get<IssueListResponse>('/issue/list', {
      params: { vesselId },
    });
    return response.data;
  },

  createIssue: async (data: CreateIssueRequest): Promise<any> => {
    const response = await apiClient.post('/issue/create', data);
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
