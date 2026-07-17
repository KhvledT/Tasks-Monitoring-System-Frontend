import { useState, useEffect } from 'react';

export interface UseCurrentTimeResult {
  utcTimeStr: string;
  utcDateStr: string;
}

export const useCurrentTime = (): UseCurrentTimeResult => {
  const [time, setTime] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatUtcTime = (date: Date): string => {
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    const seconds = String(date.getUTCSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds} UTC`;
  };

  const formatUtcDate = (date: Date): string => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    const dayName = days[date.getUTCDay()];
    const day = String(date.getUTCDate()).padStart(2, '0');
    const monthName = months[date.getUTCMonth()];
    const year = date.getUTCFullYear();

    return `${dayName}, ${day} ${monthName} ${year}`;
  };

  return {
    utcTimeStr: formatUtcTime(time),
    utcDateStr: formatUtcDate(time),
  };
};

export default useCurrentTime;
