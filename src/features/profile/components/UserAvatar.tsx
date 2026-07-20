import React from 'react';
import { motion } from 'framer-motion';

interface UserAvatarProps {
  initials: string;
  fullName: string;
  avatarUrl?: string;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({ initials, fullName, avatarUrl }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.25 }}
      className="w-24 h-24 rounded-full bg-sky-950/60 border-4 border-sky-200/30 flex items-center justify-center shadow-inner shrink-0 overflow-hidden relative"
      role="img"
      aria-label={`Avatar for ${fullName || 'officer'}`}
    >
      {avatarUrl ? (
        <img src={avatarUrl} alt={fullName} className="w-full h-full object-cover" />
      ) : (
        <span className="text-2xl font-bold text-sky-400 tracking-tight">{initials}</span>
      )}
      {/* Camera icon overlay */}
      <div className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center border-2 border-zinc-950">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-4 h-4 text-white">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
        </svg>
      </div>
    </motion.div>
  );
};

export default UserAvatar;
