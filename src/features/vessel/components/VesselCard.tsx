import React from 'react';
import type { Vessel } from '../types/vessel.types';
import { motion } from 'framer-motion';

interface VesselCardProps {
  vessel: Vessel;
  isActivating: boolean;
  onActivate: (id: string) => void;
}

export const VesselCard: React.FC<VesselCardProps> = ({ vessel, isActivating, onActivate }) => {
  const id = (vessel as any)._id || vessel.id;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`border rounded-2xl p-6 flex flex-col justify-between backdrop-blur-md transition-all ${
        vessel.isActive
          ? 'border-sky-500 bg-sky-950/15 shadow-[0_0_15px_rgba(14,165,233,0.15)]'
          : 'border-zinc-800 bg-zinc-950/30 hover:border-zinc-700'
      }`}
    >
      <div>
        <div className="flex items-start justify-between mb-4">
          <div>
            <h4 className="text-lg font-bold text-zinc-100 tracking-tight leading-tight mb-1">{vessel.name}</h4>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-400 border border-zinc-700/50">
              {vessel.type}
            </span>
          </div>
          {vessel.isActive && (
            <span className="text-xs font-bold px-2.5 py-1 rounded-full border border-sky-500 bg-sky-950/50 text-sky-400 shadow-[inset_0_0_6px_rgba(14,165,233,0.2)]">
              Active Context
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6 border-t border-zinc-900 pt-4">
          <div>
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">GRT</span>
            <span className="text-sm font-semibold text-zinc-300">
              {vessel.grt ? `${vessel.grt.toLocaleString()} t` : '0 t'}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">DWT</span>
            <span className="text-sm font-semibold text-zinc-300">
              {vessel.dwt ? `${vessel.dwt.toLocaleString()} t` : '0 t'}
            </span>
          </div>
        </div>
      </div>

      {!vessel.isActive && (
        <button
          onClick={() => onActivate(id)}
          disabled={isActivating}
          className="w-full font-semibold px-4 py-2.5 rounded-xl border border-zinc-800 bg-zinc-900 hover:bg-zinc-850 hover:border-zinc-700 text-zinc-200 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
        >
          {isActivating ? (
            <>
              <svg className="animate-spin h-4 w-4 text-zinc-400" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Activating...</span>
            </>
          ) : (
            'Select Vessel'
          )}
        </button>
      )}
    </motion.div>
  );
};
export default VesselCard;
