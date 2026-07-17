import React from 'react';
import type { IssueItem } from '../types/issue.types';
import { motion, AnimatePresence } from 'framer-motion';

interface IssueDetailsDrawerProps {
  isOpen: boolean;
  issue: IssueItem | null;
  onClose: () => void;
}

export const IssueDetailsDrawer: React.FC<IssueDetailsDrawerProps> = ({
  isOpen,
  issue,
  onClose,
}) => {
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
    <AnimatePresence>
      {isOpen && issue && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-xs cursor-pointer"
          />

          {/* Drawer container sliding from right */}
          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10 pointer-events-none">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-screen max-w-md bg-zinc-950 border-l border-zinc-900 pointer-events-auto flex flex-col shadow-2xl h-full"
            >
              {/* Drawer Header */}
              <div className="px-6 py-5 border-b border-zinc-900 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-zinc-100 tracking-tight">Issue Log Details</h3>
                  <p className="text-[11px] text-zinc-450 mt-0.5">Linked Task audit record info</p>
                </div>
                <button
                  onClick={onClose}
                  className="p-1 rounded-lg text-zinc-500 hover:bg-zinc-900 hover:text-zinc-200 transition cursor-pointer"
                  aria-label="Close drawer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Scrollable details area */}
              <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-5">
                {/* Linked task section */}
                <div className="bg-zinc-900/30 border border-zinc-900/60 p-4 rounded-xl">
                  <span className="text-[9px] font-bold text-sky-400 uppercase tracking-wider block mb-1">
                    Linked Task Title
                  </span>
                  <p className="text-xs font-bold text-zinc-150 leading-snug">{issue.taskTitle}</p>
                  <span className="text-[10px] text-zinc-500 font-mono block mt-2">
                    ID: {issue.taskRecordId}
                  </span>
                </div>

                {/* Date logged */}
                <div className="flex flex-col gap-1.5 border-b border-zinc-900/40 pb-4">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                    Log Date
                  </span>
                  <span className="text-xs font-semibold text-zinc-200 font-mono">
                    {getFormattedDateString(issue.issueDate)}
                  </span>
                </div>

                {/* Description */}
                <div className="flex flex-col gap-1.5 border-b border-zinc-900/40 pb-4">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                    Defect Description
                  </span>
                  <p className="text-xs text-zinc-250 font-medium leading-relaxed bg-zinc-900/10 p-3 rounded-lg border border-zinc-900/30">
                    {issue.description}
                  </p>
                </div>

                {/* Notes */}
                {issue.note && (
                  <div className="flex flex-col gap-1.5 border-b border-zinc-900/40 pb-4">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                      Internal Notes
                    </span>
                    <p className="text-xs text-zinc-350 font-medium leading-relaxed bg-zinc-900/10 p-3 rounded-lg border border-zinc-900/30 italic">
                      {issue.note}
                    </p>
                  </div>
                )}

                {/* Photo attachment if available */}
                {issue.imageUrl && (
                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                      Photo Evidence Attachment
                    </span>
                    <div className="relative rounded-xl overflow-hidden border border-zinc-800 bg-black/40 aspect-video group">
                      <img
                        src={issue.imageUrl}
                        alt="Issue Attachment Evidence"
                        className="w-full h-full object-cover group-hover:scale-[1.02] transition duration-300"
                        onError={(e) => {
                          // Fallback display if image url breaks
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                      <div className="absolute bottom-2.5 right-2.5 bg-black/70 px-2 py-0.5 rounded border border-zinc-800 text-[9px] text-sky-400 font-bold select-all">
                        {issue.imageUrl.substring(0, 30)}...
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default IssueDetailsDrawer;
