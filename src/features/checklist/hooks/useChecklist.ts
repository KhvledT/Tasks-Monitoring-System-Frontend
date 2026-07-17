import { useActiveVessel } from '../../../shared/hooks/useActiveVessel';
import { useChecklistDate } from './useChecklistDate';
import { useChecklistTasks } from './useChecklistTasks';
import { useChecklistFilters } from './useChecklistFilters';
import { useChecklistSearch } from './useChecklistSearch';
import { checklistFilterService } from '../services/checklist-filter.service';
import type { ChecklistCategoryGroup } from '../types/checklist.types';

export interface UseChecklistResult {
  categories: ChecklistCategoryGroup[];
  isLoading: boolean;
  error: Error | null;
  isEmpty: boolean;
  activeVesselName: string;
  selectedGroup: string;
  setSelectedGroup: (group: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  formattedDate: string;
}

export const useChecklist = (): UseChecklistResult => {
  const { activeVessel, activeVesselId } = useActiveVessel();
  
  const { selectedDate, setSelectedDate, formattedDate } = useChecklistDate();
  const { selectedGroup, setSelectedGroup } = useChecklistFilters();
  const { searchQuery, setSearchQuery } = useChecklistSearch();

  const vesselId = activeVesselId || '';

  const {
    data: rawCategories = [],
    isLoading: isTasksLoading,
    error: tasksError,
  } = useChecklistTasks(vesselId, selectedDate, !!vesselId && !!selectedDate);

  const isLoading = !vesselId || isTasksLoading;
  
  const error = tasksError
    ? (tasksError instanceof Error ? tasksError : new Error(String(tasksError)))
    : null;

  // Apply sequential filtering using our pure filter service
  let filtered = checklistFilterService.filterTasksByGroup(rawCategories, selectedGroup);
  filtered = checklistFilterService.filterTasksBySearch(filtered, searchQuery);

  const isEmpty = !isLoading && !error && filtered.length === 0;

  return {
    categories: filtered,
    isLoading,
    error,
    isEmpty,
    activeVesselName: activeVessel?.name || 'No Vessel Selected',
    selectedGroup,
    setSelectedGroup,
    searchQuery,
    setSearchQuery,
    selectedDate,
    setSelectedDate,
    formattedDate,
  };
};

export default useChecklist;
