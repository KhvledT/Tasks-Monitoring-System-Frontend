import React from 'react';
import type { IssueItem } from '../types/issue.types';
import { Card } from '@heroui/react';
import { motion } from 'framer-motion';

interface IssueCardProps {
  issue: IssueItem;
  onSelect: (issue: IssueItem) => void;
}

export const IssueCard: React.FC<IssueCardProps> = ({ issue, onSelect }) => {
  const getFormattedDateString = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      
      const months = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
      ];
      
      const day = d.getDate();
      const month = months[d.getMonth()];
      const year = d.getFullYear();
      
      return `${day} ${month} ${year}`;
    } catch {
      return dateStr;
    }
  };

  const getSeverityBadgeClass = (sev: string) => {
    switch (sev) {
      case 'CRITICAL':
        return 'bg-red-500 text-white border-red-600';
      case 'MAJOR':
        return 'bg-orange-500 text-white border-orange-600';
      case 'MINOR':
        return 'bg-blue-500 text-white border-blue-600';
      case 'OBSERVATION':
        return 'bg-zinc-500 text-white border-zinc-600';
      default:
        return 'bg-zinc-500 text-white border-zinc-600';
    }
  };



  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.15 }}
      className="cursor-pointer h-full"
      onClick={() => onSelect(issue)}
    >
      <Card className="border border-zinc-900 bg-zinc-950/40 hover:border-zinc-800 p-5 rounded-2xl flex flex-col justify-between h-full gap-4 transition duration-200 shadow-md group">
        <div className="flex flex-col gap-2.5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-wrap items-center gap-1.5">
              {issue.severity && (
                <span className={`text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border shrink-0 ${getSeverityBadgeClass(issue.severity)}`}>
                  {issue.severity}
                </span>
              )}
              <span className="text-[9px] font-bold text-zinc-500 font-mono">
                DEF-{String(issue.id).slice(-4)}
              </span>
            </div>
            <span className="text-[10px] text-zinc-550 font-mono shrink-0">
              {getFormattedDateString(issue.issueDate)}
            </span>
          </div>

          <p className="text-xs font-bold text-zinc-200 line-clamp-2 leading-relaxed">
            {issue.description}
          </p>

          {issue.note && (
            <p className="text-[11px] text-zinc-450 line-clamp-2 italic leading-normal border-l border-zinc-800 pl-2.5">
              {issue.note}
            </p>
          )}

          {issue.imageUrl && (
            <div className="w-full h-32 rounded-xl overflow-hidden border border-zinc-850 bg-zinc-900 mt-1">
              <img src={issue.imageUrl} alt="Defect evidence attachment" className="w-full h-full object-cover" />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3 mt-auto">
          {(issue.status || 'OPEN').toUpperCase() === 'IN_PROGRESS' && (
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-[9px] text-zinc-500">
                <span>Progress</span>
                <span>65%</span>
              </div>
              <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: '65%' }} />
              </div>
            </div>
          )}

          <div className="flex items-center justify-between border-t border-zinc-900/50 pt-3.5">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                <div className="w-6 h-6 rounded-full bg-blue-500 border-2 border-zinc-950 flex items-center justify-center text-[8px] text-white font-bold">
                  CE
                </div>
                <div className="w-6 h-6 rounded-full bg-emerald-500 border-2 border-zinc-950 flex items-center justify-center text-[8px] text-white font-bold">
                  ET
                </div>
              </div>
            </div>

            <div className="text-[10px] text-zinc-400 group-hover:text-sky-400 font-bold transition flex items-center gap-1">
              Details
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3 h-3 group-hover:translate-x-0.5 transition-transform">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default IssueCard;
