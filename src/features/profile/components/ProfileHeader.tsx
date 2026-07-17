import React from 'react';

interface ProfileHeaderProps {
  onLogout: () => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ onLogout }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-900 pb-5 mb-6">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-100 font-sans">
          Profile & Settings
        </h1>
        <p className="text-sm text-zinc-400 mt-1">
          Account details and session information for the signed-in officer.
        </p>
      </div>

      <button
        onClick={onLogout}
        type="button"
        className="flex items-center justify-center gap-2 px-4 py-2.5 bg-zinc-950 text-zinc-300 hover:bg-zinc-900/80 border border-zinc-800 text-xs font-semibold rounded-xl transition duration-150 active:scale-[0.98]"
        aria-label="Sign out of your account"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
        </svg>
        Sign Out
      </button>
    </div>
  );
};

export default ProfileHeader;
