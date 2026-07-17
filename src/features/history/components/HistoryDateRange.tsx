import React from 'react';

interface HistoryDateRangeProps {
  startDate: string;
  onStartDateChange: (date: string) => void;
  endDate: string;
  onEndDateChange: (date: string) => void;
}

export const HistoryDateRange: React.FC<HistoryDateRangeProps> = ({
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
}) => {
  const handleClear = () => {
    onStartDateChange('');
    onEndDateChange('');
  };

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full bg-zinc-950/20 border border-zinc-900 p-4 rounded-2xl shadow-sm">
      <span className="text-xs font-semibold text-zinc-550 uppercase tracking-wider whitespace-nowrap">
        Date Range Selection:
      </span>

      <div className="flex flex-1 items-center gap-2 flex-wrap sm:flex-nowrap">
        {/* Start Date */}
        <div className="relative flex-1 min-w-[130px]">
          <input
            type="date"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            className="w-full px-3 py-2 bg-zinc-950 border border-zinc-900 text-zinc-300 text-xs font-medium rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/50 hover:bg-zinc-900/40 transition cursor-pointer"
          />
        </div>

        <span className="text-xs text-zinc-500 font-bold shrink-0">to</span>

        {/* End Date */}
        <div className="relative flex-1 min-w-[130px]">
          <input
            type="date"
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
            className="w-full px-3 py-2 bg-zinc-950 border border-zinc-900 text-zinc-300 text-xs font-medium rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/50 hover:bg-zinc-900/40 transition cursor-pointer"
          />
        </div>

        {(startDate || endDate) && (
          <button
            onClick={handleClear}
            type="button"
            className="px-3 py-2 text-xs font-semibold text-sky-400 hover:text-sky-350 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 rounded-xl transition active:scale-[0.98] cursor-pointer"
          >
            Clear Range
          </button>
        )}
      </div>
    </div>
  );
};

export default HistoryDateRange;
