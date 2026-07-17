import React from 'react';
import { motion } from 'framer-motion';

interface EmptyVesselStateProps {
  onRegisterClick: () => void;
}

export const EmptyVesselState: React.FC<EmptyVesselStateProps> = ({ onRegisterClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center text-center p-8 border border-dashed border-zinc-800 rounded-2xl bg-zinc-950/40 backdrop-blur-md max-w-md mx-auto"
    >
      <div className="w-16 h-16 rounded-2xl bg-sky-950/50 border border-sky-900/50 flex items-center justify-center text-sky-400 mb-6 shadow-inner">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3" />
        </svg>
      </div>
      <h3 className="text-lg font-bold text-zinc-100 mb-2">No Vessels Registered</h3>
      <p className="text-sm text-zinc-400 mb-6">
        There are no vessels associated with your profile. To access the monitoring dashboard, you must register a vessel.
      </p>
      <button
        onClick={onRegisterClick}
        className="w-full font-semibold px-4 py-2.5 rounded-xl border border-sky-500 bg-sky-600 hover:bg-sky-500 text-white shadow-lg shadow-sky-950/20 active:scale-[0.98] transition-all focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-black"
      >
        Register New Vessel
      </button>
    </motion.div>
  );
};
export default EmptyVesselState;
