import { useQuery } from '@tanstack/react-query';
import { historyApi } from '../api/history.api';
import { HISTORY_KEYS } from '../../../constants/query-keys/history';
import { historyMapperService } from '../services/history-mapper.service';
import type { HistoryPagination } from '../types/history.types';

export const useHistoryList = (
  vesselId: string,
  page: number,
  limit: number,
  startDate?: string,
  endDate?: string,
  enabled = true
) => {
  return useQuery<HistoryPagination>({
    queryKey: HISTORY_KEYS.list(vesselId, { startDate, endDate }, page),
    queryFn: async () => {
      const response = await historyApi.getHistoryRecords(vesselId, page, limit, startDate, endDate);
      const normalized = historyMapperService.mapToPaginatedHistory(response);
      return normalized;
    },
    enabled: enabled && !!vesselId,
  });
};

export default useHistoryList;
