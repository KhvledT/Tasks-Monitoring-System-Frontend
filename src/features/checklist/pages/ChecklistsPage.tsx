import React, { useState } from 'react';
import { useChecklist } from '../hooks/useChecklist';
import { useCompleteTask } from '../hooks/useCompleteTask';
import { usePostponeTask } from '../hooks/usePostponeTask';
import { ChecklistHeader } from '../components/ChecklistHeader';
import { ChecklistFilters } from '../components/ChecklistFilters';
import { ChecklistSearch } from '../components/ChecklistSearch';
import { ChecklistCategory } from '../components/ChecklistCategory';
import { ChecklistEmptyState } from '../components/ChecklistEmptyState';
import { ChecklistSkeleton } from '../components/ChecklistSkeleton';
import { CompleteTaskModal } from '../components/CompleteTaskModal';
import { PostponeTaskModal } from '../components/PostponeTaskModal';
import { useActiveVessel } from '../../../shared/hooks/useActiveVessel';
import { useActiveWatch } from '../../watchSession/hooks/useWatchSession';
import type { ChecklistTask } from '../types/checklist.types';

export const ChecklistsPage: React.FC = () => {
  const { activeVesselId, isArchiveMode } = useActiveVessel();
  const { data: activeWatch } = useActiveWatch(activeVesselId || undefined);

  const {
    categories,
    isLoading,
    error,
    isEmpty,
    activeVesselName,
    selectedGroup,
    setSelectedGroup,
    searchQuery,
    setSearchQuery,
    selectedDate,
    setSelectedDate,
    formattedDate,
  } = useChecklist();

  // Mutation Hooks
  const { mutateAsync: completeTask, isPending: isCompleting } = useCompleteTask();
  const { mutateAsync: postponeTask, isPending: isPostponing } = usePostponeTask();

  // Page-Level Modal State Management
  const [selectedTask, setSelectedTask] = useState<ChecklistTask | null>(null);
  const [activeModal, setActiveModal] = useState<'complete' | 'postpone' | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleTaskAction = (task: ChecklistTask, action: 'complete' | 'postpone') => {
    setSelectedTask(task);
    setActiveModal(action);
    setSubmitError(null);
  };

  const handleCompleteSubmit = async (recordId: string, notes?: string, measurement?: string) => {
    setSubmitError(null);
    try {
      await completeTask({ recordId, data: { notes, measurement } });
      setActiveModal(null);
      setSelectedTask(null);
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to record completion';
      setSubmitError(msg);
    }
  };

  const handlePostponeSubmit = async (recordId: string, reason: string) => {
    setSubmitError(null);
    try {
      await postponeTask({ recordId, data: { reason } });
      setActiveModal(null);
      setSelectedTask(null);
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to postpone task';
      setSubmitError(msg);
    }
  };

  const handleModalClose = () => {
    setActiveModal(null);
    setSelectedTask(null);
    setSubmitError(null);
  };

  if (isLoading) {
    return <ChecklistSkeleton />;
  }

  return (
    <div className="flex flex-col gap-6 w-full animate-fade-in">
      {/* 1. Page Header with active vessel context and date picker */}
      <ChecklistHeader
        vesselName={activeVesselName}
        selectedDate={selectedDate}
        formattedDate={formattedDate}
        onDateChange={setSelectedDate}
      />

      {activeVesselId && activeWatch === null && (
        <div className="p-5 bg-amber-955/20 border border-amber-900/40 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-start sm:items-center gap-3 text-amber-400 font-bold text-xs leading-relaxed">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 shrink-0 mt-0.5 sm:mt-0">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376C1.83 19.13 2.014 21 3.752 21h16.496c1.738 0 1.922-1.87 1.054-3.376C20.43 16.12 18.232 12.33 16.1 8.65c-.87-1.503-2.607-1.503-3.477 0L3.303 17.626ZM12 17.25h.007v.007H12v-.007Z" />
            </svg>
            <div>
              <p className="font-extrabold text-[13px] text-amber-300">Watch Session Offline</p>
              <p className="text-zinc-400 font-medium text-[11px] mt-0.5">There is no active watchkeeping shift started for this vessel. You must start a watch session before completing deck walks.</p>
            </div>
          </div>
          <a
            href="/dashboard?startWatch=true"
            className="px-4.5 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs rounded-xl transition shadow-lg active:scale-95 text-center shrink-0"
          >
            Start Watch Session
          </a>
        </div>
      )}

      {/* Checklist Statistics Bar */}
      {categories.length > 0 && (() => {
        const allTasks = categories.flatMap(cat => cat.tasks);
        const total = allTasks.length;
        const completed = allTasks.filter(t => String(t.status).toLowerCase() === 'completed' || String(t.status) === '1').length;
        const postponed = allTasks.filter(t => String(t.status).toLowerCase() === 'postponed' || String(t.status) === '2').length;
        const remaining = total - completed - postponed;
        const compliance = total > 0 ? Math.round((completed / total) * 100) : 0;
        const issuesCount = allTasks.filter(t => t.hasIssue).length;

        return (
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 bg-zinc-950/20 border border-zinc-900 rounded-2xl p-4 shadow-lg">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Total Checks</span>
              <span className="text-lg font-bold text-zinc-200">{total}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Completed</span>
              <span className="text-lg font-bold text-emerald-400">{completed}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Remaining</span>
              <span className="text-lg font-bold text-sky-400">{remaining}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Postponed</span>
              <span className="text-lg font-bold text-amber-400">{postponed}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Issues Raised</span>
              <span className="text-lg font-bold text-red-400">{issuesCount}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Completion Rate</span>
              <span className="text-lg font-bold text-sky-400">{compliance}%</span>
            </div>
          </div>
        );
      })()}

      {error ? (
        /* Error Alert State */
        <div className="p-5 bg-red-950/20 border border-red-900/40 rounded-2xl flex flex-col gap-2.5 shadow-xl">
          <div className="flex items-center gap-2 text-red-400 font-bold text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
            </svg>
            Failed to Load Checklists
          </div>
          <p className="text-xs text-zinc-400 font-medium leading-relaxed">
            There was a problem loading checklist logs for this date.
          </p>
          <div className="bg-black/40 border border-zinc-900/60 p-3.5 rounded-xl font-mono text-xs text-red-350 select-all">
            {error.message || 'Unknown server or network error.'}
          </div>
        </div>
      ) : (
        /* Checklists Workspace Layout */
        <>
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 justify-between">
            <ChecklistFilters selectedGroup={selectedGroup} onChange={setSelectedGroup} />
            <ChecklistSearch value={searchQuery} onChange={setSearchQuery} />
          </div>

          {isEmpty ? (
            /* 2. Empty State View */
            <ChecklistEmptyState />
          ) : (
            /* 3. Normalized categories layout */
            <div className="flex flex-col mt-2">
              {categories.map((group) => (
                <ChecklistCategory
                  key={group.category.id}
                  group={group}
                  onTaskAction={handleTaskAction}
                  isArchiveMode={isArchiveMode}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Page-level modals coordinates */}
      <CompleteTaskModal
        isOpen={activeModal === 'complete'}
        task={selectedTask}
        isLoading={isCompleting}
        errorMsg={submitError}
        onSubmit={handleCompleteSubmit}
        onCancel={handleModalClose}
      />

      <PostponeTaskModal
        isOpen={activeModal === 'postpone'}
        task={selectedTask}
        isLoading={isPostponing}
        errorMsg={submitError}
        onSubmit={handlePostponeSubmit}
        onCancel={handleModalClose}
      />
    </div>
  );
};

export default ChecklistsPage;
