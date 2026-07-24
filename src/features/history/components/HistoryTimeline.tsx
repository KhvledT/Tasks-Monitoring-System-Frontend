import React, { useState } from 'react';
import type { HistoryItem } from '../types/history.types';
import { Card } from '@heroui/react';
import { ImagePreviewModal } from '../../../shared/components/ImagePreviewModal';

interface HistoryTimelineProps {
  items: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const HistoryTimeline: React.FC<HistoryTimelineProps> = ({
  items,
  onSelect,
  page,
  totalPages,
  onPageChange,
}) => {
  const [previewImage, setPreviewImage] = useState<{ src: string; title: string } | null>(null);
  const getTimelineGroup = (dateStr: string): string => {
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return 'Older';

      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const itemDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

      const diffTime = today.getTime() - itemDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 0) return 'Today';
      if (diffDays === 1) return 'Yesterday';
      if (diffDays > 1 && diffDays <= 7) return 'Earlier This Week';
      if (diffDays > 7 && diffDays <= 14) return 'Last Week';
      return 'Older';
    } catch {
      return 'Older';
    }
  };

  const getFormattedTime = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return '';
      const hours = String(d.getHours()).padStart(2, '0');
      const minutes = String(d.getMinutes()).padStart(2, '0');
      return `${hours}:${minutes} UTC`;
    } catch {
      return '';
    }
  };

  // Group items by timeline bucket
  const groupedTimeline = React.useMemo(() => {
    const buckets: Record<string, HistoryItem[]> = {
      'Today': [],
      'Yesterday': [],
      'Earlier This Week': [],
      'Last Week': [],
      'Older': [],
    };

    items.forEach((item) => {
      const group = getTimelineGroup(item.issueDate || item.createdAt || '');
      buckets[group].push(item);
    });

    return Object.entries(buckets).filter(([_, list]) => list.length > 0);
  }, [items]);

  const renderStatusBadge = (status: string, hasIssue?: boolean) => {
    if (hasIssue) {
      return <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-red-600 text-white uppercase tracking-wider">DEFECT REPORTED</span>;
    }
    const s = String(status).toLowerCase();
    if (s === 'completed' || s === '1') {
      return <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-emerald-500 text-white uppercase tracking-wider">COMPLETED</span>;
    }
    if (s === 'postponed' || s === '2') {
      return <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-amber-500 text-white uppercase tracking-wider">POSTPONED</span>;
    }
    return <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-blue-500 text-white uppercase tracking-wider">PERIODIC LOG</span>;
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {groupedTimeline.map(([groupName, groupItems]) => (
        <div key={groupName} className="flex flex-col gap-3">
          <div className="flex items-center gap-2 pl-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-4 h-4 text-zinc-500">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
            </svg>
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
              {groupName}
            </h3>
          </div>
          <div className="border-l-2 border-zinc-900 ml-4 pl-6 flex flex-col gap-4">
            {groupItems.map((item) => (
              <div
                key={item.id}
                onClick={() => onSelect(item)}
                className="relative cursor-pointer group"
              >
                <Card className="border border-zinc-900 bg-zinc-950/40 hover:border-zinc-800 p-4 rounded-xl flex flex-col gap-3 transition duration-200 shadow-md">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex flex-col gap-2 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        {renderStatusBadge(item.status, item.hasIssue || !!item.issue)}
                        <span className="text-[10px] text-zinc-550 font-mono">
                          {getFormattedTime(item.issueDate || item.createdAt || '')}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-zinc-200 group-hover:text-sky-400 transition leading-snug">
                        {item.title}
                      </h4>
                      {item.notes && (
                        <p className="text-[11px] text-zinc-450 italic line-clamp-2">
                          {item.notes}
                        </p>
                      )}
                      {item.issue && (
                        <div className="mt-1 bg-red-950/30 border border-red-900/40 p-2.5 rounded-lg flex items-center gap-2 text-xs text-red-300">
                          <span className="font-bold text-red-400">⚠️ Defect ({item.issue.severity}):</span>
                          <span className="truncate">{item.issue.description}</span>
                        </div>
                      )}
                    </div>
                    {/* Optional image thumbnail - ONLY display if image exists */}
                    {item.issue?.imageUrl && (
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewImage({
                            src: item.issue!.imageUrl!,
                            title: `Defect Photo: ${item.title}`,
                          });
                        }}
                        className="w-20 h-16 bg-zinc-900 rounded-lg flex items-center justify-center shrink-0 border border-zinc-850 overflow-hidden cursor-pointer hover:scale-105 transition shadow-sm"
                        title="Click to preview photo evidence"
                      >
                        <img src={item.issue.imageUrl} alt="Defect Attachment" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-zinc-900/50">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-blue-500 border-2 border-zinc-950 flex items-center justify-center text-[8px] text-white font-bold">
                        {item.completedBy ? item.completedBy.fullName?.split(' ').map(n => n[0]).join('') : 'CE'}
                      </div>
                      <span className="text-[10px] text-zinc-500 font-medium">
                        {item.completedBy?.fullName || 'Chief Engineer'}
                      </span>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-zinc-900/50 pt-4 mt-2 px-2">
          <button
            onClick={() => onPageChange(Math.max(1, page - 1))}
            disabled={page === 1}
            className="px-4 py-2 border border-zinc-850 hover:bg-zinc-900 disabled:opacity-50 disabled:pointer-events-none text-zinc-450 hover:text-zinc-250 text-xs font-semibold rounded-lg transition"
          >
            Previous
          </button>
          <span className="text-[11px] text-zinc-500 font-medium">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => onPageChange(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 border border-zinc-850 hover:bg-zinc-900 disabled:opacity-50 disabled:pointer-events-none text-zinc-450 hover:text-zinc-250 text-xs font-semibold rounded-lg transition"
          >
            Next
          </button>
        </div>
      )}

      {/* Image Preview Lightbox */}
      <ImagePreviewModal
        isOpen={!!previewImage}
        src={previewImage?.src || null}
        title={previewImage?.title || 'Defect Attachment Preview'}
        onClose={() => setPreviewImage(null)}
      />
    </div>
  );
};

export default HistoryTimeline;
