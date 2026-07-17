import { useState } from 'react';

export interface UseHistoryDateRangeResult {
  startDate: string;
  setStartDate: (date: string) => void;
  endDate: string;
  setEndDate: (date: string) => void;
}

export const useHistoryDateRange = (): UseHistoryDateRangeResult => {
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  return {
    startDate,
    setStartDate,
    endDate,
    setEndDate,
  };
};

export default useHistoryDateRange;
