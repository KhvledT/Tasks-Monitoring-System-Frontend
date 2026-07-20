import React from 'react';

interface AuthCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export const AuthCard: React.FC<AuthCardProps> = ({ title, subtitle, children }) => {
  return (
    <div className="flex flex-col gap-6">
      <div className="text-left">
        <h2 className="text-2xl font-bold text-black tracking-tight">{title}</h2>
        {subtitle && <p className="text-zinc-500 text-xs mt-1 leading-relaxed">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
};
export default AuthCard;
