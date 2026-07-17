import React from 'react';

interface HistoryFiltersProps {
  selectedGroup: string;
  onGroupChange: (group: string) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
}

export const HistoryFilters: React.FC<HistoryFiltersProps> = ({
  selectedGroup,
  onGroupChange,
  selectedStatus,
  onStatusChange,
}) => {
  const groups = [
    { label: 'All Task Groups', value: 'all' },
    { label: 'Daily Checks', value: 'Daily' },
    { label: 'Weekly Checks', value: 'Weekly' },
    { label: 'Monthly Checks', value: 'Monthly' },
    { label: 'Signing-On', value: 'SigningOn' },
  ];

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 justify-between w-full bg-zinc-950/20 border border-zinc-900 p-4 rounded-2xl shadow-sm">
      {/* Group Selector Tabs */}
      <div className="flex bg-zinc-950 p-1 rounded-xl border border-zinc-900 overflow-x-auto gap-1">
        {groups.map((group) => {
          const isActive = selectedGroup === group.value;
          return (
            <button
              key={group.value}
              type="button"
              onClick={() => onGroupChange(group.value)}
              className={`whitespace-nowrap px-4 py-2 text-xs font-semibold rounded-lg transition-all duration-150 ${
                isActive
                  ? 'bg-sky-950/50 text-sky-400 border border-sky-950/65 shadow-sm'
                  : 'text-zinc-450 hover:text-zinc-200 hover:bg-zinc-900/40 border border-transparent'
              }`}
            >
              {group.label}
            </button>
          );
        })}
      </div>

      {/* Status Selector Dropdown */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider whitespace-nowrap">
          Filter Status:
        </span>
        <select
          value={selectedStatus}
          onChange={(e) => onStatusChange(e.target.value)}
          className="px-3 py-2 bg-zinc-950 border border-zinc-900 text-zinc-300 text-xs font-medium rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/50 hover:bg-zinc-900/40 transition cursor-pointer"
        >
          <option value="all">All Statuses</option>
          <option value="Completed">Completed</option>
          <option value="Postponed">Postponed</option>
        </select>
      </div>
    </div>
  );
};

export default HistoryFilters;
