import { useState } from 'react';

export interface UseChecklistDateResult {
  selectedDate: string; // YYYY-MM-DD
  setSelectedDate: (date: string) => void;
  formattedDate: string; // e.g. "15 Jul 2026"
}

export const useChecklistDate = (): UseChecklistDateResult => {
  const getTodayString = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [selectedDate, setSelectedDate] = useState<string>(getTodayString());

  const getFormattedDateString = (dateStr: string) => {
    try {
      // Split to avoid timezone offset shifts on parse
      const [year, month, day] = dateStr.split('-').map(Number);
      // month is 0-indexed in JS Dates
      const d = new Date(year, month - 1, day);
      
      const months = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
      ];
      const dayNum = d.getDate();
      const monthName = months[d.getMonth()];
      const yearNum = d.getFullYear();

      return `${dayNum} ${monthName} ${yearNum}`;
    } catch {
      return dateStr;
    }
  };

  return {
    selectedDate,
    setSelectedDate,
    formattedDate: getFormattedDateString(selectedDate),
  };
};

export default useChecklistDate;
