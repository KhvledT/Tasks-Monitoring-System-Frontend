import React from 'react';

interface HistoryHeaderProps {
  vesselName: string;
  isExportingPdf: boolean;
  isExportingExcel: boolean;
  onExportPdf: () => void;
  onExportExcel: () => void;
}

export const HistoryHeader: React.FC<HistoryHeaderProps> = ({
  vesselName,
  isExportingPdf,
  isExportingExcel,
  onExportPdf,
  onExportExcel,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-900 pb-5 mb-6">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-100 font-sans">
          Logbook Audit History
        </h1>
        <p className="text-sm text-zinc-400 mt-1">
          Active Workspace: <span className="font-semibold text-sky-400">{vesselName}</span>
        </p>
      </div>

      <div className="flex items-center gap-2">
        {/* Export PDF Button */}
        <button
          onClick={onExportPdf}
          disabled={isExportingPdf}
          type="button"
          className="flex items-center gap-2 px-4 py-2.5 bg-zinc-900 hover:bg-zinc-850/80 border border-zinc-800 text-zinc-350 hover:text-zinc-200 text-xs font-semibold rounded-xl transition disabled:opacity-50 active:scale-[0.98] cursor-pointer"
        >
          {isExportingPdf ? (
            <svg className="animate-spin h-3.5 w-3.5 text-zinc-400" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-red-400/90">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m.75 12 3 3m0 0 3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
            </svg>
          )}
          {isExportingPdf ? 'Exporting PDF...' : 'Export PDF'}
        </button>

        {/* Export Excel Button */}
        <button
          onClick={onExportExcel}
          disabled={isExportingExcel}
          type="button"
          className="flex items-center gap-2 px-4 py-2.5 bg-zinc-900 hover:bg-zinc-850/80 border border-zinc-800 text-zinc-350 hover:text-zinc-200 text-xs font-semibold rounded-xl transition disabled:opacity-50 active:scale-[0.98] cursor-pointer"
        >
          {isExportingExcel ? (
            <svg className="animate-spin h-3.5 w-3.5 text-zinc-400" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-emerald-400/90">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m.75 12 3 3m0 0 3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
            </svg>
          )}
          {isExportingExcel ? 'Exporting Excel...' : 'Export Excel'}
        </button>
      </div>
    </div>
  );
};

export default HistoryHeader;
