import React from 'react';
import { Card } from '@heroui/react';
import { motion } from 'framer-motion';
import { UserAvatar } from './UserAvatar';
import type { Profile } from '../types/profile.types';

interface ProfileCardProps {
  profile: Profile;
  initials: string;
  rankLabel: string;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  profile,
  initials,
  rankLabel,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="border border-zinc-900 bg-zinc-950/40 p-6 rounded-2xl backdrop-blur-md">
        <div className="flex flex-col items-center gap-5">
          <UserAvatar initials={initials} fullName={profile.fullName} avatarUrl={(profile as any).avatarUrl} />

          <div className="text-center">
            <h2 className="text-lg font-bold text-zinc-100 tracking-tight">
              {profile.fullName || 'Unnamed Officer'}
            </h2>
            <p className="text-sm text-zinc-400 mt-0.5">{rankLabel}</p>
          </div>

          <div className="w-full flex flex-col gap-3">
            <div className="flex items-center justify-between py-2 border-b border-zinc-900/50">
              <span className="text-xs text-zinc-500">Email</span>
              <span className="text-xs font-semibold text-zinc-200">{profile.email}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-zinc-900/50">
              <span className="text-xs text-zinc-500">Sign-on Date</span>
              <span className="text-xs font-semibold text-zinc-200">Oct 15, 2026</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-zinc-900/50">
              <span className="text-xs text-zinc-500">Company</span>
              <span className="text-xs font-semibold text-zinc-200">{(profile as any).company || 'Atlantic Shipping'}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-xs text-zinc-500">Vessel ID</span>
              <span className="text-xs font-semibold text-zinc-200 font-mono">{(profile as any).vesselId || 'IMO 9123456'}</span>
            </div>
          </div>

          {/* Security Status Card */}
          <div className="w-full bg-zinc-900/40 border border-zinc-900 rounded-xl p-4 flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5 text-emerald-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="text-xs font-bold text-zinc-200">Security Status</h4>
              <p className="text-[10px] text-zinc-400 mt-1 leading-relaxed">
                Two-factor authentication is enabled for your account.
              </p>
              <button
                type="button"
                className="mt-2 text-[10px] font-bold text-emerald-400 hover:text-emerald-300 transition"
              >
                UPDATE SECURITY SETTINGS
              </button>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default ProfileCard;
