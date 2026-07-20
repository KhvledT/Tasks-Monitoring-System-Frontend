import { apiClient } from '../../../lib/axios';
import type {
  WatchSession,
  StartWatchRequest,
  HandoverWatchRequest,
  CompleteWatchRequest,
} from '../types/watchSession.types';

export const watchSessionApi = {
  getActiveWatch: async (vesselId: string): Promise<WatchSession | null> => {
    const response = await apiClient.get<{ result: WatchSession | null }>('/watch-session/active', {
      params: { vesselId },
    });
    return response.data.result;
  },

  startWatch: async (data: StartWatchRequest): Promise<WatchSession> => {
    const response = await apiClient.post<{ result: WatchSession }>('/watch-session/start', data);
    return response.data.result;
  },

  pauseWatch: async (sessionId: string): Promise<WatchSession> => {
    const response = await apiClient.post<{ result: WatchSession }>(`/watch-session/${sessionId}/pause`);
    return response.data.result;
  },

  resumeWatch: async (sessionId: string): Promise<WatchSession> => {
    const response = await apiClient.post<{ result: WatchSession }>(`/watch-session/${sessionId}/resume`);
    return response.data.result;
  },

  handoverWatch: async (sessionId: string, data: HandoverWatchRequest): Promise<WatchSession> => {
    const response = await apiClient.post<{ result: WatchSession }>(`/watch-session/${sessionId}/handover`, data);
    return response.data.result;
  },

  completeWatch: async (sessionId: string, data: CompleteWatchRequest): Promise<WatchSession> => {
    const response = await apiClient.post<{ result: WatchSession }>(`/watch-session/${sessionId}/complete`, data);
    return response.data.result;
  },
};

export default watchSessionApi;
