import React from 'react';

interface AuthCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export const AuthCard: React.FC<AuthCardProps> = ({ title, subtitle, children }) => {
  return (
    <div className="flex flex-col gap-6">
      <div className="text-center md:text-left">
        <h2 className="text-xl font-bold text-zinc-100 tracking-tight">{title}</h2>
        {subtitle && <p className="text-zinc-550 text-xs mt-1">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
};
export default AuthCard;
