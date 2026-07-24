import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { useUploadAvatar } from '../hooks/useUploadAvatar';
import { toast } from 'react-hot-toast';

interface UserAvatarProps {
  initials: string;
  fullName: string;
  avatarUrl?: string;
  onAvatarUpdated?: (newUrl: string) => void;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({ initials, fullName, avatarUrl, onAvatarUpdated }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadAvatarMutation = useUploadAvatar();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Only image files are supported.');
      return;
    }
    if (file.size > 100 * 1024 * 1024) {
      toast.error('Image size must be less than 100MB.');
      return;
    }

    const loadingToast = toast.loading('Uploading profile picture...');
    try {
      const res = await uploadAvatarMutation.mutateAsync(file);
      toast.dismiss(loadingToast);
      toast.success('Profile picture updated successfully!');
      if (res?.result?.avatarUrl && onAvatarUpdated) {
        onAvatarUpdated(res.result.avatarUrl);
      }
    } catch (err: any) {
      toast.dismiss(loadingToast);
      toast.error(err.response?.data?.message || 'Failed to upload profile picture.');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.25 }}
      onClick={() => fileInputRef.current?.click()}
      className="w-24 h-24 rounded-full bg-sky-950/60 border-4 border-sky-200/30 flex items-center justify-center shadow-inner shrink-0 overflow-hidden relative cursor-pointer group"
      role="button"
      tabIndex={0}
      aria-label={`Upload avatar for ${fullName || 'officer'}`}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      {avatarUrl ? (
        <img src={avatarUrl} alt={fullName} className="w-full h-full object-cover group-hover:opacity-80 transition" />
      ) : (
        <span className="text-2xl font-bold text-sky-400 tracking-tight group-hover:scale-105 transition">{initials}</span>
      )}
      {/* Camera icon overlay */}
      <div className="absolute bottom-0 right-0 w-8 h-8 bg-primary hover:bg-[#003fa3] rounded-full flex items-center justify-center border-2 border-zinc-950 transition shadow-md">
        {uploadAvatarMutation.isPending ? (
          <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-4 h-4 text-white">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
          </svg>
        )}
      </div>
    </motion.div>
  );
};

export default UserAvatar;
