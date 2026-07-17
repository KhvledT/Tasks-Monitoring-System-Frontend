import React, { useState, useRef, useEffect } from 'react';
import { useVessels } from '../hooks/useVessels';
import { useActivateVessel } from '../hooks/useActivateVessel';
import { useActiveVessel } from '../../../shared/hooks/useActiveVessel';

export const VesselSelector: React.FC = () => {
  const { activeVessel, activeVesselId } = useActiveVessel();
  const { data: vessels, isLoading } = useVessels();
  const { mutateAsync: activateVessel, isPending: isActivating } = useActivateVessel();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleSelect = async (vesselId: string) => {
    if (vesselId === activeVesselId) return;
    setIsOpen(false);
    try {
      await activateVessel(vesselId);
    } catch (e) {
      console.error('Failed to switch vessel:', e);
    }
  };

  if (isLoading) {
    return <div className="h-10 w-full bg-zinc-900/60 border border-zinc-800/80 animate-pulse rounded-xl" />;
  }

  // Filter out current active vessel for dropdown selection
  const otherVessels = vessels?.filter((v) => {
    const id = (v as any)._id || v.id;
    return id !== activeVesselId;
  }) || [];

  return (
    <div className="relative w-full" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={isActivating}
        className="w-full flex items-center justify-between gap-2.5 px-4 py-3 rounded-xl border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900 text-sm font-semibold text-zinc-100 transition duration-150 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-sky-500/50"
      >
        <div className="flex items-center gap-2 truncate">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          <span className="truncate text-zinc-200">{activeVessel?.name || 'Select Vessel'}</span>
        </div>
        {isActivating ? (
          <svg className="animate-spin h-4 w-4 text-zinc-400 shrink-0" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        ) : (
          <svg className={`h-4 w-4 text-zinc-500 transition-transform shrink-0 duration-200 ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 mt-2 rounded-xl border border-zinc-800 bg-zinc-950 shadow-2xl z-50 py-1.5 overflow-hidden animate-in fade-in duration-100">
          {otherVessels.length === 0 ? (
            <div className="px-4 py-2.5 text-xs text-zinc-500 text-center">
              No other vessels available
            </div>
          ) : (
            otherVessels.map((v) => {
              const id = (v as any)._id || v.id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => handleSelect(id)}
                  className="w-full text-left px-4 py-2.5 hover:bg-zinc-900/60 transition flex flex-col gap-0.5 border-b border-zinc-900/40 last:border-0"
                >
                  <span className="font-bold text-sm text-zinc-200">{v.name}</span>
                  <span className="text-xs text-zinc-500">{v.type}</span>
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};
export default VesselSelector;
