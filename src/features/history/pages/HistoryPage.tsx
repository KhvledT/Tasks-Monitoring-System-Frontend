import React from 'react';
import { useHistory } from '../hooks/useHistory';
import { useHistorySelection } from '../hooks/useHistorySelection';
import { HistoryHeader } from '../components/HistoryHeader';
import { HistoryFilters } from '../components/HistoryFilters';
import { HistorySearch } from '../components/HistorySearch';
import { HistoryDateRange } from '../components/HistoryDateRange';
import { HistoryTimeline } from '../components/HistoryTimeline';
import { HistoryDetailsDrawer } from '../components/HistoryDetailsDrawer';
import { HistoryEmptyState } from '../components/HistoryEmptyState';
import { HistorySkeleton } from '../components/HistorySkeleton';

export const HistoryPage: React.FC = () => {
  const {
    items,
    isLoading,
    error,
    isEmpty,
    selectedGroup,
    setSelectedGroup,
    selectedStatus,
    setSelectedStatus,
    searchQuery,
    setSearchQuery,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    page,
    setPage,
    totalPages,
  } = useHistory();

  // Drawer Selection Hook
  const { selectedHistoryItem, isOpen: isDrawerOpen, open: openDrawer, close: closeDrawer } = useHistorySelection();

  if (isLoading) {
    return <HistorySkeleton />;
  }

  return (
    <div className="flex flex-col gap-6 w-full animate-fade-in pb-10">
      {/* 1. Page Header */}
      <HistoryHeader />

      {error ? (
        /* Error Alert State */
        <div className="p-5 bg-red-955/20 border border-red-900/40 rounded-2xl flex flex-col gap-2.5 shadow-xl">
          <div className="flex items-center gap-2 text-red-400 font-bold text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
            </svg>
            System Synchronization Failure
          </div>
          <p className="text-xs text-zinc-400 font-medium leading-relaxed">
            There was a problem retrieving the logbook audit records from the shore servers.
          </p>
          <div className="bg-black/40 border border-zinc-900/60 p-3.5 rounded-xl font-mono text-xs text-red-350 select-all">
            {error.message || 'Unknown network or application error.'}
          </div>
        </div>
      ) : (
        /* History Dashboard Layout */
        <>
          {/* Calendar Picker Controls */}
          <HistoryDateRange
            startDate={startDate}
            onStartDateChange={setStartDate}
            endDate={endDate}
            onEndDateChange={setEndDate}
          />

          {/* Group and status filter dropdown switcher */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 justify-between">
            <HistoryFilters
              selectedGroup={selectedGroup}
              onGroupChange={setSelectedGroup}
              selectedStatus={selectedStatus}
              onStatusChange={setSelectedStatus}
            />
            <HistorySearch value={searchQuery} onChange={setSearchQuery} />
          </div>

          {isEmpty ? (
            /* 2. Empty view */
            <HistoryEmptyState />
          ) : (
            /* 3. Table grid layout */
            <HistoryTimeline
              items={items}
              onSelect={openDrawer}
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          )}
        </>
      )}

      {/* Right sliding details drawer */}
      <HistoryDetailsDrawer
        isOpen={isDrawerOpen}
        item={selectedHistoryItem}
        onClose={closeDrawer}
      />
    </div>
  );
};

export default HistoryPage;
