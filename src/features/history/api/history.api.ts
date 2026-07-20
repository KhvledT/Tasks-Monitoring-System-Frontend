import { apiClient } from '../../../lib/axios';
import type { HistoryListResponse } from '../types/history.types';

export const historyApi = {
  getHistoryRecords: async (
    vesselId: string,
    page: number,
    limit: number,
    startDate?: string,
    endDate?: string,
    search?: string,
    taskGroup?: string,
    status?: number,
    signal?: AbortSignal
  ): Promise<HistoryListResponse> => {
    const response = await apiClient.get<HistoryListResponse>('/history', {
      params: { vesselId, page, limit, startDate, endDate, search, taskGroup, status },
      signal,
    });
    return response.data;
  },

  exportPdf: async (
    vesselId: string,
    config: any
  ): Promise<Blob> => {
    const response = await apiClient.post('/export/pdf', {
      vesselId,
      ...config
    }, {
      responseType: 'blob',
    });
    return response.data;
  },

  exportExcel: async (
    vesselId: string,
    config: any
  ): Promise<Blob> => {
    const response = await apiClient.post('/export/excel', {
      vesselId,
      ...config
    }, {
      responseType: 'blob',
    });
    return response.data;
  },
};

export default historyApi;
