import React from 'react';

interface IssuesHeaderProps {
  onRegisterNewClick: () => void;
  isArchiveMode?: boolean;
}

export const IssuesHeader: React.FC<IssuesHeaderProps> = ({
  onRegisterNewClick,
  isArchiveMode = false,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-900 pb-5 mb-6">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-100 font-sans">
          Defect Logbook
        </h1>
        <p className="text-sm text-zinc-400 mt-1">
          Managing active technical issues and operational safety concerns.
        </p>
      </div>

      {!isArchiveMode && (
        <button
          onClick={onRegisterNewClick}
          type="button"
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-primary hover:bg-[#003fa3] text-white text-xs font-semibold rounded-xl transition duration-150 active:scale-[0.98] cursor-pointer shadow-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Register New Issue
        </button>
      )}
    </div>
  );
};

export default IssuesHeader;
