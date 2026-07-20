import React, { useState } from 'react';
import { useActiveVessel } from '../../../shared/hooks/useActiveVessel';
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
    activeVesselId,
    sortBy,
    setSortBy,
    searchQuery,
    setSearchQuery,
  } = useIssues();

  const { isArchiveMode } = useActiveVessel();

  // Task Selection Query
  const { data: taskOptions = [] } = useIssueTaskSelection(activeVesselId, !!activeVesselId);

  // Mutation Hooks
  const { mutateAsync: createIssue, isPending: isCreating } = useCreateIssue();

  // Page level dialogs context
  const [selectedIssue, setSelectedIssue] = useState<IssueItem | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  
  // Grouping state
  const [groupBy, setGroupBy] = useState<'status' | 'severity' | 'none'>('status');

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

  // Render status grouping layout
  const renderStatusGroups = () => {
    const statuses = [
      { key: 'OPEN', title: 'Open', color: 'border-red-500/30 text-red-400 bg-red-950/10' },
      { key: 'IN_PROGRESS', title: 'In Progress', color: 'border-amber-500/30 text-amber-400 bg-amber-950/10' },
      { key: 'RESOLVED', title: 'Resolved', color: 'border-emerald-500/30 text-emerald-400 bg-emerald-950/10' },
    ];

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start mt-4">
        {statuses.map((group) => {
          const groupIssues = issues.filter(
            (issue) => (issue.status || 'OPEN').toUpperCase() === group.key
          );

          return (
            <div key={group.key} className="bg-zinc-950/20 border border-zinc-900/60 p-4.5 rounded-2xl flex flex-col gap-4 min-h-[300px]">
              <div className={`flex items-center justify-between border-b border-zinc-900/60 pb-3 font-sans`}>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-zinc-300">
                    {group.title}
                  </span>
                  <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-md bg-zinc-900 border border-zinc-850 text-zinc-500">
                    {groupIssues.length}
                  </span>
                </div>
                <button className="text-zinc-500 hover:text-zinc-300 cursor-pointer">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                  </svg>
                </button>
              </div>

              {groupIssues.length === 0 ? (
                <div className="text-center py-8 text-zinc-600 text-[11px] italic font-medium bg-zinc-900/10 border border-dashed border-zinc-900 rounded-xl">
                  No {group.title} issues
                </div>
              ) : (
                <div className="flex flex-col gap-3.5 max-h-[500px] overflow-y-auto pr-1">
                  {groupIssues.map((issue) => (
                    <IssueCard
                      key={issue.id}
                      issue={issue}
                      onSelect={setSelectedIssue}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  // Render severity grouping layout
  const renderSeverityGroups = () => {
    const severities = [
      { key: 'CRITICAL', title: 'Critical', color: 'border-red-500/30 text-red-400 bg-red-950/10' },
      { key: 'MAJOR', title: 'Major', color: 'border-amber-500/30 text-amber-400 bg-amber-950/10' },
      { key: 'MINOR', title: 'Minor', color: 'border-blue-500/30 text-blue-400 bg-blue-950/10' },
      { key: 'OBSERVATION', title: 'Observation', color: 'border-zinc-800 text-zinc-400 bg-zinc-900/40' },
    ];

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start mt-4">
        {severities.map((group) => {
          const groupIssues = issues.filter(
            (issue) => (issue.severity || 'MINOR').toUpperCase() === group.key
          );

          return (
            <div key={group.key} className="bg-zinc-950/20 border border-zinc-900/60 p-4.5 rounded-2xl flex flex-col gap-4 min-h-[300px]">
              <div className="flex items-center justify-between border-b border-zinc-900/60 pb-3 font-sans">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-zinc-300">
                    {group.title}
                  </span>
                  <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-md bg-zinc-900 border border-zinc-850 text-zinc-500">
                    {groupIssues.length}
                  </span>
                </div>
                <button className="text-zinc-500 hover:text-zinc-300 cursor-pointer">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                  </svg>
                </button>
              </div>

              {groupIssues.length === 0 ? (
                <div className="text-center py-8 text-zinc-600 text-[11px] italic font-medium bg-zinc-900/10 border border-dashed border-zinc-900 rounded-xl">
                  No {group.title} defects
                </div>
              ) : (
                <div className="flex flex-col gap-3.5 max-h-[500px] overflow-y-auto pr-1">
                  {groupIssues.map((issue) => (
                    <IssueCard
                      key={issue.id}
                      issue={issue}
                      onSelect={setSelectedIssue}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-6 w-full animate-fade-in pb-10">
      {/* 1. Page Header with active vessel information */}
      <IssuesHeader
        onRegisterNewClick={() => setIsCreateOpen(true)}
        isArchiveMode={isArchiveMode}
      />

      {error ? (
        /* Error alert state */
        <div className="p-5 bg-red-955/20 border border-red-900/40 rounded-2xl flex flex-col gap-2.5 shadow-xl">
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
          {/* Bottom status bar */}
          <div className="fixed bottom-0 left-0 right-0 bg-zinc-950 border-t border-zinc-900 px-6 py-2 flex items-center justify-between text-[10px] text-zinc-500 font-medium z-40">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                SYSTEMS ONLINE
              </span>
              <span className="font-mono">Lat: 54.123° N | Long: 2.341° E</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-3.5 h-3.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                </svg>
                Sync: 4m ago
              </span>
              <span className="font-mono">v2.4.1</span>
            </div>
          </div>

          <div className="pb-8">
          {/* Controls switcher, grouping & search bar */}
          <div className="flex flex-col gap-4">
            {/* Search bar with filter pills */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="flex-1 relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-4.5 h-4.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                  </svg>
                </span>
                <input
                  type="text"
                  placeholder="Search defects by ID, title, or system..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-900 rounded-xl pl-10 pr-4 py-2.5 text-sm text-zinc-200 outline-none focus:border-primary transition placeholder-zinc-550"
                />
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <button className="px-3 py-2 bg-zinc-900 border border-zinc-850 text-zinc-400 text-xs font-semibold rounded-lg hover:bg-zinc-850 transition cursor-pointer">
                  All Systems
                </button>
                <button className="px-3 py-2 bg-zinc-900 border border-zinc-850 text-zinc-400 text-xs font-semibold rounded-lg hover:bg-zinc-850 transition cursor-pointer">
                  All Severities
                </button>
                <button className="px-3 py-2 bg-zinc-900 border border-zinc-850 text-zinc-400 text-xs font-semibold rounded-lg hover:bg-zinc-850 transition cursor-pointer">
                  More Filters
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4.5">
              <IssueFilters sortBy={sortBy} onChange={setSortBy} />
              
              {/* Grouping switcher */}
              <div className="flex items-center gap-2 border-t sm:border-t-0 sm:border-l border-zinc-900 pt-3 sm:pt-0 sm:pl-4">
                <span className="text-[10px] font-bold text-zinc-550 uppercase tracking-wider">Group By:</span>
                <div className="flex bg-zinc-900 p-0.5 rounded-lg border border-zinc-850/80">
                  {(['status', 'severity', 'none'] as const).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setGroupBy(mode)}
                      className={`px-3 py-1.5 text-[9px] font-bold uppercase rounded-md transition cursor-pointer ${
                        groupBy === mode
                          ? 'bg-zinc-800 text-sky-400 border border-zinc-700/30'
                          : 'text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="w-full xl:w-72">
              <IssueSearch value={searchQuery} onChange={setSearchQuery} />
            </div>
          </div>

          {isEmpty ? (
            /* 2. Empty View */
            <IssuesEmptyState />
          ) : groupBy === 'status' ? (
            renderStatusGroups()
          ) : groupBy === 'severity' ? (
            renderSeverityGroups()
          ) : (
            /* 3. Flat responsive grid list */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {issues.map((issue) => (
                <IssueCard
                  key={issue.id}
                  issue={issue}
                  onSelect={setSelectedIssue}
                />
              ))}
            </div>
          )}
          </div>
        </>
      )}

      {/* Slide-out drawer displaying reported details logs */}
      <IssueDetailsDrawer
        isOpen={!!selectedIssue}
        issue={selectedIssue}
        onClose={() => setSelectedIssue(null)}
        isArchiveMode={isArchiveMode}
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
