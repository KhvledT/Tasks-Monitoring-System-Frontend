import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { watchSessionApi } from '../api/watchSession.api';
import type { HandoverWatchRequest, CompleteWatchRequest } from '../types/watchSession.types';

export const useActiveWatch = (vesselId: string | undefined) => {
  return useQuery({
    queryKey: ['watch-session', 'active', vesselId],
    queryFn: () => watchSessionApi.getActiveWatch(vesselId || ''),
    enabled: !!vesselId,
  });
};

export const useStartWatch = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (vesselId: string) => watchSessionApi.startWatch({ vesselId }),
    onSuccess: (_, vesselId) => {
      queryClient.invalidateQueries({ queryKey: ['watch-session', 'active', vesselId] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
};

export const usePauseWatch = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (sessionId: string) => watchSessionApi.pauseWatch(sessionId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['watch-session', 'active', data.vesselId] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
};

export const useResumeWatch = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (sessionId: string) => watchSessionApi.resumeWatch(sessionId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['watch-session', 'active', data.vesselId] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
};

export const useHandoverWatch = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ sessionId, data }: { sessionId: string; data: HandoverWatchRequest }) =>
      watchSessionApi.handoverWatch(sessionId, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['watch-session', 'active', data.vesselId] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
};

export const useCompleteWatch = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ sessionId, data }: { sessionId: string; data: CompleteWatchRequest }) =>
      watchSessionApi.completeWatch(sessionId, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['watch-session', 'active', data.vesselId] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
};
