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
      
      const hours = String(d.getHours()).padStart(2, '0');
      const minutes = String(d.getMinutes()).padStart(2, '0');

      return `${day} ${month} ${year} at ${hours}:${minutes} UTC`;
    } catch {
      return dateStr;
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
            <span className="text-[9px] font-bold text-sky-400 uppercase tracking-wider bg-sky-950/30 px-2 py-0.5 rounded border border-sky-900/30 truncate max-w-[180px]">
              {issue.taskTitle}
            </span>
            <span className="text-[10px] text-zinc-550 font-mono shrink-0">
              {getFormattedDateString(issue.issueDate).split(' at ')[0]}
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
        </div>

        <div className="flex items-center justify-between border-t border-zinc-900/50 pt-3.5 mt-auto">
          {issue.imageUrl ? (
            <div className="flex items-center gap-1.5 text-[10px] text-sky-400 font-semibold">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1.75 0Z" />
              </svg>
              <span>Photo Attached</span>
            </div>
          ) : (
            <span className="text-[10px] text-zinc-600 font-medium">No Attachment</span>
          )}

          <div className="text-[10px] text-zinc-400 group-hover:text-sky-400 font-bold transition flex items-center gap-1">
            View Details
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3 h-3 group-hover:translate-x-0.5 transition-transform">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default IssueCard;
