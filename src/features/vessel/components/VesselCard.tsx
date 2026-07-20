import React from 'react';
import type { Vessel } from '../types/vessel.types';
import { motion } from 'framer-motion';

interface VesselCardProps {
  vessel: Vessel;
  isActivating: boolean;
  isDeleting: boolean;
  anyActionPending: boolean;
  onActivate: (id: string) => void;
  onViewArchive: (vessel: Vessel) => void;
  onEdit: (vessel: Vessel) => void;
  onDelete: (id: string, isActive: boolean) => void;
}

export const VesselCard: React.FC<VesselCardProps> = ({
  vessel,
  isActivating,
  isDeleting,
  anyActionPending,
  onActivate,
  onViewArchive,
  onEdit,
  onDelete,
}) => {
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
            <span className="text-[10px] text-zinc-550 uppercase tracking-wider block">GRT</span>
            <span className="text-sm font-semibold text-zinc-300">
              {vessel.grt ? `${vessel.grt.toLocaleString()} t` : '0 t'}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-zinc-550 uppercase tracking-wider block">DWT</span>
            <span className="text-sm font-semibold text-zinc-300">
              {vessel.dwt ? `${vessel.dwt.toLocaleString()} t` : '0 t'}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 border-t border-zinc-900/60 pt-4 mt-auto">
        <div className="flex gap-2">
          {!vessel.isActive ? (
            <>
              <button
                type="button"
                onClick={() => onActivate(id)}
                disabled={anyActionPending}
                className="flex-1 font-bold px-3 py-2 bg-sky-950 text-sky-400 hover:bg-sky-900/35 border border-sky-900/60 text-xs rounded-xl transition active:scale-[0.98] disabled:opacity-50 cursor-pointer text-center"
              >
                {isActivating ? 'Activating...' : 'Set Active'}
              </button>
              
              <button
                type="button"
                onClick={() => onViewArchive(vessel)}
                disabled={anyActionPending}
                className="flex-1 font-bold px-3 py-2 bg-zinc-900 border border-zinc-850 hover:bg-zinc-850 hover:border-zinc-700 text-zinc-350 hover:text-zinc-200 text-xs rounded-xl transition active:scale-[0.98] disabled:opacity-50 cursor-pointer text-center"
              >
                View Archives
              </button>
            </>
          ) : (
            <div className="flex-1 text-center py-2 text-xs font-semibold text-sky-400 bg-sky-950/20 rounded-xl border border-sky-900/40">
              Active Operational Vessel
            </div>
          )}
        </div>

        <div className="flex gap-2 items-center justify-end mt-1">
          <button
            onClick={() => onEdit(vessel)}
            type="button"
            disabled={anyActionPending}
            className="p-2 rounded-lg border border-zinc-850 bg-zinc-950/40 hover:bg-zinc-900 hover:text-zinc-200 text-zinc-400 transition disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
            title="Edit Vessel"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.83 20.04a4.5 4.5 0 0 1-2.074 1.219l-3.548.885.885-3.548a4.5 4.5 0 0 1 1.219-2.074L16.862 4.487Zm0 0L19.5 7.125" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(id, vessel.isActive || false)}
            type="button"
            disabled={anyActionPending}
            className="p-2 rounded-lg border border-zinc-850 bg-zinc-950/40 hover:bg-red-955/20 hover:border-red-900 hover:text-red-400 text-zinc-400 transition disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
            title="Delete Vessel"
          >
            {isDeleting ? (
              <svg className="animate-spin h-3.5 w-3.5 text-red-400" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};
export default VesselCard;
