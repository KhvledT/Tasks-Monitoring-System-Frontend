import React from 'react';
import { Card } from '@heroui/react';
import { motion } from 'framer-motion';
import { UserAvatar } from './UserAvatar';
import type { Profile } from '../types/profile.types';

interface ProfileCardProps {
  profile: Profile;
  initials: string;
  roleLabel: string;
  rankLabel: string;
  statusLabel: string;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  profile,
  initials,
  roleLabel,
  rankLabel,
  statusLabel,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="border border-zinc-900 bg-zinc-950/40 p-6 rounded-2xl backdrop-blur-md">
        <div className="flex flex-col sm:flex-row gap-5 sm:items-start">
          <UserAvatar initials={initials} fullName={profile.fullName} />

          <div className="flex flex-col gap-4 min-w-0 flex-1">
            <div>
              <h2 className="text-lg font-bold text-zinc-100 tracking-tight truncate">
                {profile.fullName || 'Unnamed Officer'}
              </h2>
              <p className="text-sm text-zinc-400 mt-0.5 truncate">{profile.email}</p>
            </div>

            <dl className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="flex flex-col gap-1 bg-zinc-900/40 border border-zinc-900 rounded-xl px-3 py-2.5">
                <dt className="text-[10px] uppercase tracking-widest font-semibold text-zinc-500">Rank</dt>
                <dd className="text-sm font-semibold text-zinc-200">{rankLabel}</dd>
              </div>
              <div className="flex flex-col gap-1 bg-zinc-900/40 border border-zinc-900 rounded-xl px-3 py-2.5">
                <dt className="text-[10px] uppercase tracking-widest font-semibold text-zinc-500">Role</dt>
                <dd className="text-sm font-semibold text-zinc-200">{roleLabel}</dd>
              </div>
              <div className="flex flex-col gap-1 bg-zinc-900/40 border border-zinc-900 rounded-xl px-3 py-2.5">
                <dt className="text-[10px] uppercase tracking-widest font-semibold text-zinc-500">Status</dt>
                <dd className={`text-sm font-semibold ${profile.isActive ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {statusLabel}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default ProfileCard;
