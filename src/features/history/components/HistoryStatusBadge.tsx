import React from 'react';

interface HistoryStatusBadgeProps {
  status: 'Completed' | 'Postponed' | string;
}

export const HistoryStatusBadge: React.FC<HistoryStatusBadgeProps> = ({ status }) => {
  const getBadgeStyle = () => {
    const s = String(status).toLowerCase();
    switch (s) {
      case 'completed':
      case '1':
        return 'bg-emerald-950/20 text-emerald-400 border-emerald-900/50 shadow-[0_0_10px_rgba(16,185,129,0.05)]';
      case 'postponed':
      case '2':
        return 'bg-amber-950/20 text-amber-400 border-amber-900/50 shadow-[0_0_10px_rgba(245,158,11,0.05)]';
      default:
        return 'bg-sky-950/20 text-sky-400 border-sky-900/50 shadow-[0_0_10px_rgba(14,165,233,0.05)]';
    }
  };

  const getLabel = () => {
    const s = String(status).toLowerCase();
    switch (s) {
      case 'completed':
      case '1':
        return 'Completed';
      case 'postponed':
      case '2':
        return 'Postponed';
      default:
        return status;
    }
  };

  return (
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border tracking-wide uppercase shrink-0 ${getBadgeStyle()}`}>
      {getLabel()}
    </span>
  );
};

export default HistoryStatusBadge;
