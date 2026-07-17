import React from 'react';
import { motion } from 'framer-motion';

interface UserAvatarProps {
  initials: string;
  fullName: string;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({ initials, fullName }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.25 }}
      className="w-16 h-16 rounded-2xl bg-sky-950/60 border border-sky-900/50 flex items-center justify-center shadow-inner shrink-0"
      role="img"
      aria-label={`Avatar for ${fullName || 'officer'}`}
    >
      <span className="text-xl font-bold text-sky-400 tracking-tight">{initials}</span>
    </motion.div>
  );
};

export default UserAvatar;
