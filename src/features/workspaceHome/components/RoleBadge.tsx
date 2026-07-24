import React from 'react';

interface RoleBadgeProps {
  role?: string;
}

export const RoleBadge: React.FC<RoleBadgeProps> = ({ role }) => {
  if (role === 'SUPER_ADMIN') {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-purple-50 text-purple-700 border border-purple-200/80 shadow-2xs">
        <span>🛡️</span>
        <span>SUPER ADMIN</span>
      </span>
    );
  }

  if (role === 'ADMIN') {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-sky-50 text-sky-700 border border-sky-200/80 shadow-2xs">
        <span>⚓</span>
        <span>CAPTAIN</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-2xs">
      <span>👤</span>
      <span>USER</span>
    </span>
  );
};

export default RoleBadge;
