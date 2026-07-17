import React from 'react';
import { Card } from '@heroui/react';
import { motion } from 'framer-motion';
import type { Profile } from '../types/profile.types';

interface SessionInfoCardProps {
  profile: Profile;
  roleLabel: string;
  statusLabel: string;
  sessionSummary: string;
}

export const SessionInfoCard: React.FC<SessionInfoCardProps> = ({
  profile,
  roleLabel,
  statusLabel,
  sessionSummary,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.05 }}
    >
      <Card className="border border-zinc-900 bg-zinc-950/40 p-6 rounded-2xl backdrop-blur-md h-full">
        <h3 className="text-sm font-bold text-zinc-200 tracking-tight mb-1">Session Information</h3>
        <p className="text-xs text-zinc-500 mb-5 leading-relaxed">{sessionSummary}</p>

        <dl className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-3 border-b border-zinc-900 pb-2.5">
            <dt className="text-xs text-zinc-500">Signed in as</dt>
            <dd className="text-xs font-semibold text-zinc-200 truncate max-w-[60%] text-right">{profile.email}</dd>
          </div>
          <div className="flex items-center justify-between gap-3 border-b border-zinc-900 pb-2.5">
            <dt className="text-xs text-zinc-500">Account role</dt>
            <dd className="text-xs font-semibold text-sky-400">{roleLabel}</dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="text-xs text-zinc-500">Account status</dt>
            <dd className={`text-xs font-semibold ${profile.isActive ? 'text-emerald-400' : 'text-amber-400'}`}>
              {statusLabel}
            </dd>
          </div>
        </dl>
      </Card>
    </motion.div>
  );
};

export default SessionInfoCard;
