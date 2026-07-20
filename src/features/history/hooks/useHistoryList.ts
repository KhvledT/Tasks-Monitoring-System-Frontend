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
  search?: string,
  taskGroup?: string,
  status?: string,
  enabled = true
) => {
  // Translate UI dropdown values to backend schemas
  const mappedGroup = taskGroup === 'all' ? undefined : taskGroup;
  let mappedStatus: number | undefined = undefined;
  if (status === 'Completed') mappedStatus = 1;
  if (status === 'Postponed') mappedStatus = 2;

  const filters = { startDate, endDate, search, taskGroup: mappedGroup, status: mappedStatus };

  return useQuery<HistoryPagination>({
    queryKey: HISTORY_KEYS.list(vesselId, filters, page),
    queryFn: async ({ signal }) => {
      const response = await historyApi.getHistoryRecords(
        vesselId,
        page,
        limit,
        startDate,
        endDate,
        search || undefined,
        mappedGroup,
        mappedStatus,
        signal
      );
      const normalized = historyMapperService.mapToPaginatedHistory(response);
      return normalized;
    },
    enabled: enabled && !!vesselId,
  });
};

export default useHistoryList;
