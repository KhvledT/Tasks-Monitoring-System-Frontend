import React, { useState } from 'react';
import { useIssues } from '../hooks/useIssues';
import { useCreateIssue } from '../hooks/useCreateIssue';
import { useIssueTaskSelection } from '../hooks/useIssueTaskSelection';
import { useIssueForm } from '../hooks/useIssueForm';
import { IssuesHeader } from '../components/IssuesHeader';
import { IssueFilters } from '../components/IssueFilters';
import { IssueSearch } from '../components/IssueSearch';
import { IssueCard } from '../components/IssueCard';
import { CreateIssueModal } from '../components/CreateIssueModal';
import { IssueDetailsDrawer } from '../components/IssueDetailsDrawer';
import { IssuesEmptyState } from '../components/IssuesEmptyState';
import { IssuesSkeleton } from '../components/IssuesSkeleton';
import type { IssueItem, CreateIssueRequest } from '../types/issue.types';

export const IssuesPage: React.FC = () => {
  const {
    issues,
    isLoading,
    error,
    isEmpty,
    activeVesselName,
    activeVesselId,
    sortBy,
    setSortBy,
    searchQuery,
    setSearchQuery,
  } = useIssues();

  // Task Selection Query
  const { data: taskOptions = [] } = useIssueTaskSelection(activeVesselId, !!activeVesselId);

  // Mutation Hooks
  const { mutateAsync: createIssue, isPending: isCreating } = useCreateIssue();

  // Page level dialogs context
  const [selectedIssue, setSelectedIssue] = useState<IssueItem | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleCreateSubmit = async (data: CreateIssueRequest) => {
    setSubmitError(null);
    try {
      await createIssue(data);
      handleFormReset();
      setIsCreateOpen(false);
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to log issue. Please review form fields.';
      setSubmitError(msg);
    }
  };

  // Form hook coordinates
  const { form, handleSubmit, handleReset: handleFormReset } = useIssueForm({
    onSubmit: handleCreateSubmit,
  });

  const handleModalClose = () => {
    setIsCreateOpen(false);
    handleFormReset();
    setSubmitError(null);
  };

  if (isLoading) {
    return <IssuesSkeleton />;
  }

  return (
    <div className="flex flex-col gap-6 w-full animate-fade-in pb-10">
      {/* 1. Page Header with active vessel information */}
      <IssuesHeader
        vesselName={activeVesselName}
        onRegisterNewClick={() => setIsCreateOpen(true)}
      />

      {error ? (
        /* Error alert state */
        <div className="p-5 bg-red-950/20 border border-red-900/40 rounded-2xl flex flex-col gap-2.5 shadow-xl">
          <div className="flex items-center gap-2 text-red-400 font-bold text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
            </svg>
            System Synchronization Failure
          </div>
          <p className="text-xs text-zinc-400 font-medium leading-relaxed">
            There was a problem retrieving reported issues from the shore log databases.
          </p>
          <div className="bg-black/40 border border-zinc-900/60 p-3.5 rounded-xl font-mono text-xs text-red-350 select-all">
            {error.message || 'Unknown network or application error.'}
          </div>
        </div>
      ) : (
        /* Normalized Issues Board */
        <>
          {/* Controls switcher & search bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 justify-between">
            <IssueFilters sortBy={sortBy} onChange={setSortBy} />
            <IssueSearch value={searchQuery} onChange={setSearchQuery} />
          </div>

          {isEmpty ? (
            /* 2. Empty View */
            <IssuesEmptyState />
          ) : (
            /* 3. Responsive Issues Grid list */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {issues.map((issue) => (
                <IssueCard
                  key={issue.id}
                  issue={issue}
                  onSelect={(item) => setSelectedIssue(item)}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Slide-out drawer displaying reported details logs */}
      <IssueDetailsDrawer
        isOpen={!!selectedIssue}
        issue={selectedIssue}
        onClose={() => setSelectedIssue(null)}
      />

      {/* Creation Modal overlay */}
      <CreateIssueModal
        isOpen={isCreateOpen}
        isLoading={isCreating}
        errorMsg={submitError}
        taskOptions={taskOptions}
        form={form}
        onSubmit={handleSubmit}
        onCancel={handleModalClose}
      />
    </div>
  );
};

export default IssuesPage;
