import { useState } from 'react';

export interface UseIssueFiltersResult {
  sortBy: 'date' | 'task' | 'severity';
  setSortBy: (sort: 'date' | 'task' | 'severity') => void;
}

export const useIssueFilters = (): UseIssueFiltersResult => {
  const [sortBy, setSortBy] = useState<'date' | 'task' | 'severity'>('date');

  return {
    sortBy,
    setSortBy,
  };
};

export default useIssueFilters;
