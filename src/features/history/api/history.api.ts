import { apiClient } from '../../../lib/axios';
import type { HistoryListResponse } from '../types/history.types';

export const historyApi = {
  getHistoryRecords: async (
    vesselId: string,
    page: number,
    limit: number,
    startDate?: string,
    endDate?: string
  ): Promise<HistoryListResponse> => {
    const response = await apiClient.get<HistoryListResponse>('/history', {
      params: { vesselId, page, limit, startDate, endDate },
    });
    return response.data;
  },

  exportPdf: async (vesselId: string, startDate?: string, endDate?: string): Promise<Blob> => {
    const response = await apiClient.get('/export/pdf', {
      params: { vesselId, startDate, endDate },
      responseType: 'blob',
    });
    return response.data;
  },

  exportExcel: async (vesselId: string, startDate?: string, endDate?: string): Promise<Blob> => {
    const response = await apiClient.get('/export/excel', {
      params: { vesselId, startDate, endDate },
      responseType: 'blob',
    });
    return response.data;
  },
};

export default historyApi;
