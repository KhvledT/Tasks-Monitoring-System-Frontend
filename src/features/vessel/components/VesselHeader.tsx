import React from 'react';

interface VesselHeaderProps {
  onRegisterClick: () => void;
  showRegisterBtn: boolean;
}

export const VesselHeader: React.FC<VesselHeaderProps> = ({ onRegisterClick, showRegisterBtn }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-900 pb-6 mb-8">
      <div>
        <h1 className="text-2xl font-extrabold text-zinc-100 tracking-tight mb-1">Vessel Workspace Selection</h1>
        <p className="text-sm text-zinc-400">Choose your active vessel to access logs and checklist routines.</p>
      </div>
      {showRegisterBtn && (
        <button
          onClick={onRegisterClick}
          className="self-start sm:self-center font-semibold px-4 py-2.5 rounded-xl border border-sky-500 bg-sky-600/10 hover:bg-sky-600 text-sky-400 hover:text-white shadow-lg active:scale-[0.98] transition-all focus:outline-none focus:ring-2 focus:ring-sky-500"
        >
          Register Vessel
        </button>
      )}
    </div>
  );
};
export default VesselHeader;
