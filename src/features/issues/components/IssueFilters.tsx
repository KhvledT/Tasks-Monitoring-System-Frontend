import React from 'react';

interface IssueFiltersProps {
  sortBy: 'date' | 'task' | 'severity';
  onChange: (sort: 'date' | 'task' | 'severity') => void;
}

export const IssueFilters: React.FC<IssueFiltersProps> = ({
  sortBy,
  onChange,
}) => {
  const modes = [
    { label: 'Latest Logged', value: 'date' as const },
    { label: 'Group by Task', value: 'task' as const },
    { label: 'Severity Priority', value: 'severity' as const },
  ];

  return (
    <div className="flex bg-zinc-950 p-1 rounded-xl border border-zinc-900 overflow-x-auto gap-1">
      {modes.map((mode) => {
        const isActive = sortBy === mode.value;
        return (
          <button
            key={mode.value}
            type="button"
            onClick={() => onChange(mode.value)}
            className={`whitespace-nowrap px-4 py-2 text-xs font-semibold rounded-lg transition-all duration-150 ${
              isActive
                ? 'bg-sky-950/50 text-sky-400 border border-sky-950/65 shadow-sm'
                : 'text-zinc-450 hover:text-zinc-200 hover:bg-zinc-900/40 border border-transparent'
            }`}
          >
            {mode.label}
          </button>
        );
      })}
    </div>
  );
};

export default IssueFilters;
