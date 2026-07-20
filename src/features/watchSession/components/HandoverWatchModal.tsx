import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface HandoverWatchModalProps {
  isOpen: boolean;
  isLoading: boolean;
  errorMsg: string | null;
  onSubmit: (data: { incomingOfficerEmail: string; incomingOfficerPassword: string; notes?: string }) => Promise<void>;
  onCancel: () => void;
}

export const HandoverWatchModal: React.FC<HandoverWatchModalProps> = ({
  isOpen,
  isLoading,
  errorMsg,
  onSubmit,
  onCancel,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (isOpen) {
      setEmail('');
      setPassword('');
      setNotes('');
    }
  }, [isOpen]);

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
    if (!email.trim() || !password.trim()) return;
    onSubmit({
      incomingOfficerEmail: email.trim(),
      incomingOfficerPassword: password.trim(),
      notes: notes.trim() || undefined,
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-2xl z-50"
          >
            <div className="flex items-center justify-between border-b border-zinc-900 pb-4 mb-5">
              <div>
                <h3 className="text-base font-bold text-zinc-100 tracking-tight">Hand Over Watch</h3>
                <p className="text-xs text-zinc-400 mt-0.5">Authenticate incoming officer to secure shift.</p>
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
              {errorMsg && (
                <div className="p-3 bg-red-950/20 border border-red-900/40 rounded-xl text-xs text-red-400 font-medium">
                  {errorMsg}
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                  Incoming Officer Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. officer@vessel.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 focus:border-zinc-700 focus:ring-1 focus:ring-zinc-700 text-xs text-zinc-200 rounded-xl px-3.5 py-2.5 transition outline-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                  Incoming Officer Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 focus:border-zinc-700 focus:ring-1 focus:ring-zinc-700 text-xs text-zinc-200 rounded-xl px-3.5 py-2.5 transition outline-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                  Handover Notes (Optional)
                </label>
                <textarea
                  placeholder="Log any machinery details or alerts for the incoming watch..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full bg-zinc-900 border border-zinc-800 focus:border-zinc-700 focus:ring-1 focus:ring-zinc-700 text-xs text-zinc-200 rounded-xl px-3.5 py-2.5 transition outline-none resize-none"
                />
              </div>

              <div className="flex items-center gap-3 mt-4">
                <button
                  type="button"
                  onClick={onCancel}
                  className="flex-1 bg-transparent hover:bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 font-bold py-2.5 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading || !email.trim() || !password.trim()}
                  className="flex-1 bg-sky-500 hover:bg-sky-400 disabled:bg-sky-500/50 text-xs text-black font-bold py-2.5 rounded-xl transition flex items-center justify-center gap-2"
                >
                  {isLoading ? 'Verifying...' : 'Sign Handover'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default HandoverWatchModal;
