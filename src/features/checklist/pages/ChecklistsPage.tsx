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
import type { ChecklistTask } from '../types/checklist.types';

export const ChecklistsPage: React.FC = () => {
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
