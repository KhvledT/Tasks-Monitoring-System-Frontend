import { useState } from 'react';

export interface UseChecklistFiltersResult {
  selectedGroup: string;
  setSelectedGroup: (group: string) => void;
}

export const useChecklistFilters = (): UseChecklistFiltersResult => {
  const [selectedGroup, setSelectedGroup] = useState<string>('Daily');

  return {
    selectedGroup,
    setSelectedGroup,
  };
};

export default useChecklistFilters;
