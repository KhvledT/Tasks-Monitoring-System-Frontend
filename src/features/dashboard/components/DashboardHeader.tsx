import React from 'react';

interface DashboardHeaderProps {
  vesselName: string;
  utcTime: string;
  utcDate: string;
  userName: string;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  vesselName,
  utcTime,
  utcDate,
  userName,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-200 pb-5 mb-8 font-sans">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-extrabold tracking-tight text-black">
          {vesselName || 'Operational Overview'}
        </h1>
        <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500 font-semibold mt-0.5">
          <span className="text-zinc-650">Logged in: <strong className="text-black font-bold">{userName}</strong></span>
          <span>&bull;</span>
          <span className="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-3.5 h-3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18" />
            </svg>
            UTC: {utcDate} {utcTime}
          </span>
          <span>&bull;</span>
          <span className="flex items-center gap-1 font-mono text-[11px]">
            Lat: 34.0522 N | Long: 118.2437 W
          </span>
        </div>
      </div>

      {/* <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => {
            const el = document.getElementById('watchkeeping-cockpit-start-btn');
            if (el) el.click();
          }}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-primary hover:bg-[#003fa3] text-white text-xs font-bold rounded-xl transition duration-150 active:scale-[0.98] cursor-pointer shadow-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          New Entry
        </button>
      </div> */}
    </div>
  );
};

export default DashboardHeader;
