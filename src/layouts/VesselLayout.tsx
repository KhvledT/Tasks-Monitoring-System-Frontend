import React from 'react';
import { Outlet, Link } from 'react-router';
import { useAuth } from '../shared/hooks/useAuth';
import { useActiveVessel } from '../shared/hooks/useActiveVessel';
import { ROUTES } from '../constants/routes';

export const VesselLayout: React.FC = () => {
  const { logout, user } = useAuth();
  const { activeVessel } = useActiveVessel();
  
  return (
    <div className="min-h-screen bg-bg-light text-text-dark flex flex-col">
      {/* Top Minimal Bar */}
      <header className="border-b border-border-subtle bg-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-50 border border-primary/20 rounded-lg flex items-center justify-center text-primary font-bold">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-.778.099-1.533.284-2.253" />
            </svg>
          </div>
          <span className="font-bold tracking-tight">MTMS</span>
        </div>
        
        <div className="flex items-center gap-4">
          {activeVessel && (
            <Link
              to={ROUTES.DASHBOARD}
              className="text-xs text-primary hover:text-primary-dim font-semibold px-3 py-1.5 rounded-lg border border-border-subtle bg-blue-50/50 hover:bg-blue-50 transition"
            >
              Go to Dashboard
            </Link>
          )}
          <span className="text-xs text-text-muted">Officer: <strong className="text-text-dark">{user?.fullName}</strong></span>
          <button
            onClick={logout}
            className="text-xs text-red-600 hover:text-red-700 font-medium px-3 py-1.5 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100/50 transition"
          >
            Sign Out
          </button>
        </div>
      </header>
 
      {/* Content container */}
      <main className="flex-1 flex items-center justify-center p-6 relative overflow-hidden bg-bg-light">
        <div className="absolute inset-0 bg-bg-light z-0" />
        <div className="relative z-10 w-full max-w-4xl animate-fade-in">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
export default VesselLayout;
