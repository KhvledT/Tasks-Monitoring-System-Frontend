import React, { useState, useEffect } from 'react';

export const OfflineBanner: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showRestore, setShowRestore] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowRestore(true);
      const timer = setTimeout(() => {
        setShowRestore(false);
      }, 3000);
      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowRestore(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOnline) {
    return (
      <div className="bg-amber-500 text-black text-xs font-bold flex items-center justify-center gap-2 py-1.5 px-4 sticky top-0 z-50 text-center select-none shadow-sm no-print">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5 shrink-0">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
        <span>You are currently working offline. Actions will queue locally.</span>
      </div>
    );
  }

  if (showRestore) {
    return (
      <div className="bg-emerald-600 text-white text-xs font-bold flex items-center justify-center gap-2 py-1.5 px-4 sticky top-0 z-50 text-center select-none shadow-sm no-print animate-fade-in">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5 shrink-0">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
        <span>Connection restored! Syncing with operational watch...</span>
      </div>
    );
  }

  return null;
};

export default OfflineBanner;
