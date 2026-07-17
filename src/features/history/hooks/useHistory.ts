import { useEffect } from 'react';
import { useActiveVessel } from '../../../shared/hooks/useActiveVessel';
import { useHistoryFilters } from './useHistoryFilters';
import { useHistorySearch } from './useHistorySearch';
import { useHistoryDateRange } from './useHistoryDateRange';
import { useHistoryPagination } from './useHistoryPagination';
import { useHistoryList } from './useHistoryList';
import { historyFilterService } from '../services/history-filter.service';
import { historySortService } from '../services/history-sort.service';
import type { HistoryItem } from '../types/history.types';

export interface UseHistoryResult {
  items: HistoryItem[];
  isLoading: boolean;
  error: Error | null;
  isEmpty: boolean;
  activeVesselName: string;
  activeVesselId: string;
  selectedGroup: string;
  setSelectedGroup: (group: string) => void;
  selectedStatus: string;
  setSelectedStatus: (status: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  startDate: string;
  setStartDate: (date: string) => void;
  endDate: string;
  setEndDate: (date: string) => void;
  page: number;
  setPage: (page: number) => void;
  pageSize: number;
  totalPages: number;
  totalItems: number;
  nextPage: (totalPages: number) => void;
  prevPage: () => void;
}

export const useHistory = (): UseHistoryResult => {
  const { activeVessel, activeVesselId } = useActiveVessel();
  
  const { selectedGroup, setSelectedGroup, selectedStatus, setSelectedStatus } = useHistoryFilters();
  const { searchQuery, setSearchQuery } = useHistorySearch();
  const { startDate, setStartDate, endDate, setEndDate } = useHistoryDateRange();
  const { page, setPage, pageSize, nextPage, prevPage, reset: resetPage } = useHistoryPagination(20);

  const vesselId = activeVesselId || '';

  // 1. Reset pagination page count to 1 when filters or date ranges change
  useEffect(() => {
    resetPage();
  }, [selectedGroup, selectedStatus, searchQuery, startDate, endDate, resetPage]);

  // 2. Fetch records query
  const {
    data,
    isLoading: isHistoryLoading,
    error: historyError,
  } = useHistoryList(
    vesselId,
    page,
    pageSize,
    startDate || undefined,
    endDate || undefined,
    !!vesselId
  );

  const isLoading = !vesselId || isHistoryLoading;
  
  const error = historyError
    ? (historyError instanceof Error ? historyError : new Error(String(historyError)))
    : null;

  const rawItems = data?.items || [];

  // 3. Apply client-side filters
  let processed = historyFilterService.filterHistory(rawItems, searchQuery, selectedStatus, selectedGroup);

  // 4. Apply client-side sorting
  processed = historySortService.sortHistoryByDate(processed);

  const isEmpty = !isLoading && !error && processed.length === 0;

  return {
    items: processed,
    isLoading,
    error,
    isEmpty,
    activeVesselName: activeVessel?.name || 'No Vessel Selected',
    activeVesselId: vesselId,
    selectedGroup,
    setSelectedGroup,
    selectedStatus,
    setSelectedStatus,
    searchQuery,
    setSearchQuery,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    page,
    setPage,
    pageSize,
    totalPages: data?.totalPages || 1,
    totalItems: data?.totalItems || 0,
    nextPage,
    prevPage,
  };
};

export default useHistory;
