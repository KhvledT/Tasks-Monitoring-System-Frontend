import React from 'react';

interface IssueSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export const IssueSearch: React.FC<IssueSearchProps> = ({ value, onChange }) => {
  return (
    <div className="relative w-full sm:w-72">
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-550">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.637 10.637Z" />
        </svg>
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search issues description or logs..."
        className="w-full pl-9 pr-8 py-2.5 rounded-xl border border-zinc-800 bg-zinc-900/40 text-zinc-100 text-xs font-medium placeholder-zinc-500 transition duration-150 focus:outline-none focus:ring-2 focus:ring-sky-500/50 hover:bg-zinc-900/80"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-500 hover:text-zinc-350 transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default IssueSearch;
