import React from 'react';

interface IssuesHeaderProps {
  vesselName: string;
  onRegisterNewClick: () => void;
}

export const IssuesHeader: React.FC<IssuesHeaderProps> = ({
  vesselName,
  onRegisterNewClick,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-900 pb-5 mb-6">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-100 font-sans">
          Equipment Issues Log
        </h1>
        <p className="text-sm text-zinc-400 mt-1">
          Active Vessel: <span className="font-semibold text-sky-400">{vesselName}</span>
        </p>
      </div>

      <button
        onClick={onRegisterNewClick}
        type="button"
        className="flex items-center justify-center gap-2 px-4 py-2.5 bg-sky-950 text-sky-400 hover:bg-sky-900/35 border border-sky-900/60 text-xs font-semibold rounded-xl transition duration-150 active:scale-[0.98]"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        Register New Issue
      </button>
    </div>
  );
};

export default IssuesHeader;
