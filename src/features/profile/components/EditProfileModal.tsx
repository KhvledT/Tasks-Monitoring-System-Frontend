import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useUpdateProfile } from '../hooks/useUpdateProfile';
import { useUploadAvatar } from '../hooks/useUploadAvatar';
import type { Profile } from '../types/profile.types';
import { FormSelect, type SelectOption } from '../../../shared/components/forms/FormSelect';
import { DatePicker } from '../../../shared/components/forms/DatePicker';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { UserAvatar } from './UserAvatar';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: Profile;
}

interface EditProfileFormValues {
  fullName: string;
  rank: string;
  phone: string;
  company: string;
  signOnDate: string;
}

const RANK_OPTIONS: SelectOption[] = [
  { value: 'Second Officer', label: 'Second Officer' },
  { value: 'Third Officer', label: 'Third Officer' },
  { value: 'Chief Officer', label: 'Chief Officer' },
  { value: 'Master', label: 'Master' },
  { value: 'Chief Engineer', label: 'Chief Engineer' },
  { value: 'Second Engineer', label: 'Second Engineer' },
];

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
}) => {
  const updateProfileMutation = useUpdateProfile();
  const uploadAvatarMutation = useUploadAvatar();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  // Local avatar preview state
  const [localAvatarUrl, setLocalAvatarUrl] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Format sign-on date for pre-population in input format YYYY-MM-DD
  const formatInitialDate = (isoStr?: string) => {
    if (!isoStr) return '';
    try {
      const d = new Date(isoStr);
      if (isNaN(d.getTime())) return '';
      return d.toISOString().split('T')[0];
    } catch {
      return '';
    }
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditProfileFormValues>({
    defaultValues: {
      fullName: profile.fullName || '',
      rank: profile.rank || '',
      phone: (profile as any).phone || '',
      company: (profile as any).company || '',
      signOnDate: formatInitialDate(profile.signOnDate),
    },
  });

  // Re-sync values when profile updates or modal opens
  useEffect(() => {
    if (isOpen && profile) {
      reset({
        fullName: profile.fullName || '',
        rank: profile.rank || '',
        phone: (profile as any).phone || '',
        company: (profile as any).company || '',
        signOnDate: formatInitialDate(profile.signOnDate),
      });
      setLocalAvatarUrl((profile as any).avatarUrl || '');
      setErrorMsg(null);
    }
  }, [isOpen, profile, reset]);

  // Escape key handler to close the modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Supported formats check
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Supported formats are: JPEG, PNG, WEBP, GIF');
      return;
    }

    // Maximum size check (5MB)
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      toast.error('Maximum upload size is 5MB.');
      return;
    }

    try {
      const result = await uploadAvatarMutation.mutateAsync(file);
      const newAvatarUrl = result.result?.avatarUrl || '';
      setLocalAvatarUrl(newAvatarUrl);
      toast.success('Profile picture updated!');
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to upload profile picture.';
      toast.error(msg);
    }
  };

  const handleRemoveAvatar = async () => {
    try {
      await updateProfileMutation.mutateAsync({
        avatarUrl: '', // Reset
      });
      setLocalAvatarUrl('');
      toast.success('Profile picture removed.');
    } catch (err: any) {
      toast.error('Failed to remove profile picture.');
    }
  };

  const onSubmit = async (data: EditProfileFormValues) => {
    setErrorMsg(null);
    if (!data.fullName.trim()) {
      toast.error('Full name is required.');
      return;
    }
    if (!data.rank) {
      toast.error('Rank is required.');
      return;
    }
    if (!data.signOnDate) {
      toast.error('Sign-on date is required.');
      return;
    }

    try {
      await updateProfileMutation.mutateAsync({
        fullName: data.fullName.trim(),
        rank: data.rank,
        phone: data.phone.trim() || undefined,
        company: data.company.trim() || undefined,
        signOnDate: new Date(data.signOnDate).toISOString(),
      });
      toast.success('Crew details updated successfully!');
      onClose();
    } catch (e: any) {
      const msg = e.response?.data?.message || 'Failed to update crew profile details.';
      setErrorMsg(msg);
      toast.error(msg);
    }
  };

  const initials = profile.fullName
    ? profile.fullName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase()
    : 'OW';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Modal Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-2xl z-50 overflow-y-auto max-h-[90vh]"
          >
            <div className="flex items-center justify-between border-b border-zinc-900 pb-4 mb-5">
              <div>
                <h3 className="text-base font-bold text-zinc-100 tracking-tight">Edit Watch Details</h3>
                <p className="text-xs text-zinc-400 mt-0.5">Modify officer rank and watch sign-on details.</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                disabled={updateProfileMutation.isPending}
                className="p-1 rounded-lg text-zinc-500 hover:bg-zinc-900 hover:text-zinc-200 transition disabled:opacity-50 cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-955/20 border border-red-900/40 rounded-xl text-xs text-red-400 font-medium mb-4">
                {errorMsg}
              </div>
            )}

            {/* Avatar Upload block */}
            <div className="flex flex-col items-center gap-3 bg-zinc-900/20 border border-zinc-900 rounded-xl p-4.5 mb-4">
              <span className="text-[10px] font-bold text-zinc-550 uppercase tracking-wider">Profile Picture</span>
              
              <div className="relative w-20 h-20 rounded-full overflow-hidden border border-zinc-800">
                <UserAvatar
                  initials={initials}
                  fullName={profile.fullName}
                  avatarUrl={localAvatarUrl}
                />
                {uploadAvatarMutation.isPending && (
                  <div className="absolute inset-0 bg-black/75 flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 text-sky-400" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={uploadAvatarMutation.isPending}
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-sky-400 hover:text-sky-300 text-[10px] font-extrabold rounded-lg uppercase tracking-wider transition cursor-pointer"
                >
                  Upload Image
                </button>
                {localAvatarUrl && (
                  <button
                    type="button"
                    onClick={handleRemoveAvatar}
                    className="px-3 py-1.5 bg-zinc-900 border border-zinc-800 text-red-400 hover:text-red-300 text-[10px] font-extrabold rounded-lg uppercase tracking-wider transition cursor-pointer"
                  >
                    Remove
                  </button>
                )}
              </div>
              
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
              <span className="text-[9px] text-zinc-550">JPEG, PNG, WEBP or GIF (Max 5MB)</span>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-zinc-400">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Officer Name"
                  className="w-full bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-zinc-700 transition"
                  {...register('fullName')}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-zinc-400">Phone (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. +1 555-0199"
                  className="w-full bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-zinc-700 transition"
                  {...register('phone')}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-zinc-400">Company (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Blue Star Maritime"
                  className="w-full bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-zinc-700 transition"
                  {...register('company')}
                />
              </div>

              <FormSelect
                label="Deck Rank Assignment"
                options={[
                  { value: '', label: 'Select Rank...' },
                  ...RANK_OPTIONS
                ]}
                error={errors.rank?.message}
                disabled={updateProfileMutation.isPending}
                {...register('rank')}
              />

              <DatePicker
                label="Sign-on Date"
                error={errors.signOnDate?.message}
                disabled={updateProfileMutation.isPending}
                {...register('signOnDate')}
              />

              <div className="flex items-center justify-end gap-2 border-t border-zinc-900 pt-4 mt-2">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={updateProfileMutation.isPending}
                  className="px-4 py-2.5 border border-zinc-850 hover:bg-zinc-900 text-zinc-350 hover:text-zinc-200 text-xs font-semibold rounded-xl transition disabled:opacity-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateProfileMutation.isPending}
                  className="px-4 py-2.5 bg-sky-950 text-sky-400 hover:bg-sky-900/35 border border-sky-900/60 text-xs font-semibold rounded-xl transition flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50 cursor-pointer"
                >
                  {updateProfileMutation.isPending ? (
                    <>
                      <svg className="animate-spin h-3.5 w-3.5 text-sky-400" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>Saving...</span>
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
export default EditProfileModal;
