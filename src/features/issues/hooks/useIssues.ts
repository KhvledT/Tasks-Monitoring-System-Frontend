import { useActiveVessel } from '../../../shared/hooks/useActiveVessel';
import { useIssueList } from './useIssueList';
import { useIssueFilters } from './useIssueFilters';
import { useIssueSearch } from './useIssueSearch';
import { issueFilterService } from '../services/issue-filter.service';
import { issueSortService } from '../services/issue-sort.service';
import type { IssueItem } from '../types/issue.types';
import { useDebounce } from '../../../shared/hooks/useDebounce';

export interface UseIssuesResult {
  issues: IssueItem[];
  isLoading: boolean;
  error: Error | null;
  isEmpty: boolean;
  activeVesselName: string;
  activeVesselId: string;
  sortBy: 'date' | 'task' | 'severity';
  setSortBy: (sort: 'date' | 'task' | 'severity') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const useIssues = (): UseIssuesResult => {
  const { activeVessel, activeVesselId } = useActiveVessel();
  const { sortBy, setSortBy } = useIssueFilters();
  const { searchQuery, setSearchQuery } = useIssueSearch();
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const vesselId = activeVesselId || '';

  const {
    data: rawIssues = [],
    isLoading: isIssuesLoading,
    error: issuesError,
  } = useIssueList(vesselId, !!vesselId);

  const isLoading = !vesselId || isIssuesLoading;
  
  const error = issuesError
    ? (issuesError instanceof Error ? issuesError : new Error(String(issuesError)))
    : null;

  // Filter issues
  let processed = issueFilterService.filterIssuesBySearch(rawIssues, debouncedSearchQuery);

  // Sort issues
  if (sortBy === 'date') {
    processed = issueSortService.sortIssuesByDate(processed);
  } else if (sortBy === 'severity') {
    const severityScore: Record<string, number> = {
      CRITICAL: 1,
      MAJOR: 2,
      MINOR: 3,
      OBSERVATION: 4,
    };
    processed = [...processed].sort((a, b) => {
      const scoreA = severityScore[a.severity || 'MINOR'] || 3;
      const scoreB = severityScore[b.severity || 'MINOR'] || 3;
      return scoreA - scoreB;
    });
  } else {
    // Sort alphabetically by linked task name
    processed = [...processed].sort((a, b) => (a.taskTitle || '').localeCompare(b.taskTitle || ''));
  }

  const isEmpty = !isLoading && !error && processed.length === 0;

  return {
    issues: processed,
    isLoading,
    error,
    isEmpty,
    activeVesselName: activeVessel?.name || 'No Vessel Selected',
    activeVesselId: vesselId,
    sortBy,
    setSortBy,
    searchQuery,
    setSearchQuery,
  };
};

export default useIssues;
