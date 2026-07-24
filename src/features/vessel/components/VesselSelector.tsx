import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router';
import { ROUTES } from '../../../constants/routes';
import { useVessels } from '../hooks/useVessels';
import { useActiveVessel } from '../../../shared/hooks/useActiveVessel';

export const VesselSelector: React.FC = () => {
  const { activeVessel, viewedVessel, setViewedVessel, isArchiveMode, isOperationalActive } = useActiveVessel();
  const { data: vessels = [], isLoading } = useVessels();
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

  const currentVessel = viewedVessel || activeVessel;
  const currentId = currentVessel ? ((currentVessel as any)._id || currentVessel.id) : null;

  const handleSelect = (vesselId: string) => {
    const targetVessel = vessels.find((v) => ((v as any)._id || v.id) === vesselId);
    if (targetVessel) {
      setViewedVessel(targetVessel);
    }
    setIsOpen(false);
  };

  if (isLoading) {
    return <div className="h-10 w-full bg-zinc-900/60 border border-zinc-800/80 animate-pulse rounded-xl" />;
  }

  // Filter out current selected vessel for dropdown selection
  const otherVessels = vessels.filter((v) => {
    const id = (v as any)._id || v.id;
    return id !== currentId;
  });

  return (
    <div className="relative w-full" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-2.5 px-4 py-3 rounded-xl border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900 text-sm font-semibold text-zinc-100 transition duration-150 focus:outline-none focus:ring-2 focus:ring-sky-500/50 cursor-pointer"
      >
        <div className="flex items-center gap-2 truncate">
          <span
            className={`w-2 h-2 rounded-full shrink-0 ${
              isOperationalActive && !isArchiveMode ? "bg-emerald-500 animate-pulse" : "bg-amber-400"
            }`}
          />
          <span className="truncate text-zinc-200">
            {currentVessel?.name || 'Select Vessel'}
          </span>
          {isArchiveMode && (
            <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-extrabold uppercase">
              Read-Only
            </span>
          )}
        </div>
        <svg
          className={`h-4 w-4 text-zinc-500 transition-transform shrink-0 duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 mt-2 rounded-xl border border-zinc-800 bg-zinc-950 shadow-2xl z-50 py-1.5 overflow-hidden animate-in fade-in duration-100">
          <div className="max-h-60 overflow-y-auto">
            {otherVessels.length === 0 ? (
              <div className="px-4 py-2.5 text-xs text-zinc-550 text-center">
                No other vessels registered
              </div>
            ) : (
              otherVessels.map((v) => {
                const id = (v as any)._id || v.id;
                const isTargetActive = (v as any).isActive || v.vesselStatus === "Active";

                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => handleSelect(id)}
                    className="w-full text-left px-4 py-2.5 hover:bg-zinc-900/60 transition flex flex-col gap-0.5 border-b border-zinc-900/40 last:border-0 cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-zinc-200">{v.name}</span>
                      {!isTargetActive && (
                        <span className="text-[9px] uppercase font-bold text-amber-400 bg-amber-950/40 px-1.5 py-0.5 rounded">
                          Read-Only
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-zinc-500">{v.type}</span>
                  </button>
                );
              })
            )}
          </div>
          <div className="border-t border-zinc-900 mt-1.5 pt-1.5 px-2">
            <Link
              to={ROUTES.SELECT_VESSEL}
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold text-sky-400 hover:text-sky-350 bg-sky-950/20 hover:bg-sky-950/40 transition w-full text-center"
            >
              Manage & Register Vessels
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
export default VesselSelector;
