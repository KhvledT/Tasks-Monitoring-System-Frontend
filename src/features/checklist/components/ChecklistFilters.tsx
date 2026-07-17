import React from 'react';

interface ChecklistFiltersProps {
  selectedGroup: string;
  onChange: (group: string) => void;
}

export const ChecklistFilters: React.FC<ChecklistFiltersProps> = ({
  selectedGroup,
  onChange,
}) => {
  const groups = [
    { label: 'Daily Checks', value: 'Daily' },
    { label: 'Weekly Checks', value: 'Weekly' },
    { label: 'Monthly Checks', value: 'Monthly' },
    { label: 'Signing-On', value: 'SigningOn' },
  ];

  return (
    <div className="flex bg-zinc-950 p-1 rounded-xl border border-zinc-900 overflow-x-auto gap-1">
      {groups.map((group) => {
        const isActive = selectedGroup === group.value;
        return (
          <button
            key={group.value}
            type="button"
            onClick={() => onChange(group.value)}
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
  );
};

export default ChecklistFilters;
