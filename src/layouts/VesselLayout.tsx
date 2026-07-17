import React from 'react';
import { Outlet } from 'react-router';
import { useAuth } from '../shared/hooks/useAuth';

export const VesselLayout: React.FC = () => {
  const { logout, user } = useAuth();
  
  return (
    <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] flex flex-col">
      {/* Top Minimal Bar */}
      <header className="border-b border-zinc-900 bg-zinc-950 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-sky-950 border border-sky-500 rounded-lg flex items-center justify-center text-sky-400">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3" />
            </svg>
          </div>
          <span className="font-bold tracking-tight">MTMS</span>
        </div>
        
        <div className="flex items-center gap-4">
          <span className="text-xs text-zinc-400">Officer: <strong className="text-zinc-200">{user?.fullName}</strong></span>
          <button
            onClick={logout}
            className="text-xs text-red-400 hover:text-red-300 font-medium px-3 py-1.5 rounded-lg border border-red-950 bg-red-950/20 hover:bg-red-950/40 transition"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Content container */}
      <main className="flex-1 flex items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-sky-950/5 via-zinc-950 to-zinc-950 z-0" />
        <div className="relative z-10 w-full max-w-4xl animate-fade-in">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
export default VesselLayout;
