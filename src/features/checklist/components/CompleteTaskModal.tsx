import React, { useState, useEffect } from 'react';
import type { ChecklistTask } from '../types/checklist.types';
import { motion, AnimatePresence } from 'framer-motion';

interface CompleteTaskModalProps {
  isOpen: boolean;
  task: ChecklistTask | null;
  isLoading: boolean;
  errorMsg: string | null;
  onSubmit: (recordId: string, notes?: string, measurement?: string) => Promise<void>;
  onCancel: () => void;
}

export const CompleteTaskModal: React.FC<CompleteTaskModalProps> = ({
  isOpen,
  task,
  isLoading,
  errorMsg,
  onSubmit,
  onCancel,
}) => {
  const [notes, setNotes] = useState('');
  const [measurement, setMeasurement] = useState('');

  // Sync inputs with existing logs if editing
  useEffect(() => {
    if (task) {
      setNotes(task.notes || '');
      setMeasurement(task.measurement || '');
    } else {
      setNotes('');
      setMeasurement('');
    }
  }, [task]);

  // Escape key handler to close the modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCancel();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onCancel]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!task) return;
    onSubmit(task.id, notes.trim() || undefined, measurement.trim() || undefined);
  };

  return (
    <AnimatePresence>
      {isOpen && task && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Modal Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Dialog Container */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-2xl z-50 overflow-hidden"
          >
            <div className="flex items-center justify-between border-b border-zinc-900 pb-4 mb-5">
              <div>
                <h3 className="text-base font-bold text-zinc-100 tracking-tight">Complete Task</h3>
                <p className="text-xs text-zinc-400 mt-0.5">Log verification notes and instruments measurements.</p>
              </div>
              <button
                onClick={onCancel}
                className="p-1 rounded-lg text-zinc-500 hover:bg-zinc-900 hover:text-zinc-200 transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="bg-zinc-900/40 border border-zinc-900 p-3.5 rounded-xl">
                <span className="text-[9px] font-bold text-sky-400 uppercase tracking-wider block mb-0.5">
                  Task Title
                </span>
                <p className="text-xs font-bold text-zinc-200 leading-snug">{task.title}</p>
                {task.description && (
                  <p className="text-[11px] text-zinc-500 font-medium leading-normal mt-1">{task.description}</p>
                )}
              </div>

              {errorMsg && (
                <div className="p-3 bg-red-950/20 border border-red-900/40 rounded-xl text-xs text-red-400 font-medium">
                  {errorMsg}
                </div>
              )}

              {/* Notes Input */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-zinc-450">Verification Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  disabled={isLoading}
                  placeholder="Optional calibration details, deviations, or logs..."
                  rows={3}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-800 bg-zinc-900/40 text-zinc-200 text-xs font-medium placeholder-zinc-650 transition focus:outline-none focus:ring-2 focus:ring-sky-500/50 hover:bg-zinc-900/60 resize-none disabled:opacity-50 disabled:pointer-events-none"
                />
              </div>

              {/* Measurement Input */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-zinc-450">Measurement Reading</label>
                <input
                  type="text"
                  value={measurement}
                  onChange={(e) => setMeasurement(e.target.value)}
                  disabled={isLoading}
                  placeholder="e.g. 0.5 deg, 1.2 bar, Normal"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-800 bg-zinc-900/40 text-zinc-200 text-xs font-medium placeholder-zinc-650 transition focus:outline-none focus:ring-2 focus:ring-sky-500/50 hover:bg-zinc-900/60 disabled:opacity-50 disabled:pointer-events-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 border-t border-zinc-900 pt-4 mt-2">
                <button
                  type="button"
                  onClick={onCancel}
                  disabled={isLoading}
                  className="px-4 py-2.5 border border-zinc-850 hover:bg-zinc-900 text-zinc-350 hover:text-zinc-200 text-xs font-semibold rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2.5 bg-emerald-950 text-emerald-400 hover:bg-emerald-900/35 border border-emerald-900/65 text-xs font-semibold rounded-xl transition flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-3.5 w-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>Saving...</span>
                    </>
                  ) : (
                    'Mark Completed'
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CompleteTaskModal;
