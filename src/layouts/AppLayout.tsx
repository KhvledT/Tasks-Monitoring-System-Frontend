import React from 'react';
import { Outlet, Link, useLocation } from 'react-router';
import { useAuth } from '../shared/hooks/useAuth';
import { useActiveVessel } from '../shared/hooks/useActiveVessel';
import { NAVIGATION_ITEMS } from '../config/navigation';
import { VesselSelector } from '../features/vessel';

export const AppLayout: React.FC = () => {
  const { logout, user } = useAuth();
  const { activeVessel } = useActiveVessel();
  const location = useLocation();

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Dashboard':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
          </svg>
        );
      case 'Checklist':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.03 0 1.9.693 2.166 1.638m-7.377 0A48.536 48.536 0 0 1 12 3c1.2 0 2.392.049 3.57.145m-7.377 0a48.474 48.474 0 0 0-1.123.08A2.25 2.25 0 0 0 4.5 6.108V16.5A2.25 2.25 0 0 0 6.75 18.75h3.75M8.25 21h8.25" />
          </svg>
        );
      case 'Warning':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
        );
      case 'History':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
        );
      case 'Profile':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] flex flex-col md:flex-row">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r border-zinc-900 bg-zinc-950 p-5 shrink-0">
        <div className="flex items-center gap-3 mb-8 px-2">
          <div className="w-8 h-8 bg-sky-950 border border-sky-500 rounded-lg flex items-center justify-center text-sky-400">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3" />
            </svg>
          </div>
          <span className="font-bold tracking-tight text-lg">Watch log</span>
        </div>

        {activeVessel && (
          <div className="mb-6 flex flex-col gap-2 px-2">
            <p className="text-[10px] uppercase font-bold text-zinc-550 tracking-wider">Vessel Workspace</p>
            <VesselSelector />
          </div>
        )}

        <nav className="flex-1 flex flex-col gap-1.5">
          {NAVIGATION_ITEMS.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition ${
                  isActive
                    ? 'bg-sky-950/40 text-sky-400 border border-sky-950/60'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40 border border-transparent'
                }`}
              >
                {getIcon(item.icon)}
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-zinc-900 pt-4 mt-auto flex items-center justify-between">
          <div className="flex items-center gap-2 truncate">
            <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-xs text-zinc-300">
              {user?.fullName?.charAt(0).toUpperCase() || 'O'}
            </div>
            <div className="truncate">
              <p className="text-xs font-bold text-zinc-200 truncate">{user?.fullName}</p>
              <p className="text-[10px] text-zinc-500 truncate">{user?.rank || 'Officer'}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="p-1.5 text-zinc-500 hover:text-red-400 transition"
            title="Sign Out"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
            </svg>
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden border-b border-zinc-900 bg-zinc-950 px-5 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className="font-bold tracking-tight text-base">Watch log</span>
          {activeVessel && (
            <div className="max-w-[150px]">
              <VesselSelector />
            </div>
          )}
        </div>
        <button
          onClick={logout}
          className="text-xs text-red-400 font-medium"
        >
          Sign Out
        </button>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-0 relative overflow-y-auto pb-20 md:pb-0">
        <div className="p-6 md:p-8 flex-1 flex flex-col max-w-7xl w-full mx-auto animate-fade-in">
          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t border-zinc-900 bg-zinc-950/80 backdrop-blur-lg px-4 py-2 flex items-center justify-around z-50">
        {NAVIGATION_ITEMS.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-1 py-1 px-3 transition ${
                isActive ? 'text-sky-400' : 'text-zinc-500'
              }`}
            >
              {getIcon(item.icon)}
              <span className="text-[9px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};
export default AppLayout;
