import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useUpdateProfile } from '../../profile';
import { FormSelect, type SelectOption } from '../../../shared/components/forms/FormSelect';
import { DatePicker } from '../../../shared/components/forms/DatePicker';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';

interface OnboardingModalProps {
  isOpen: boolean;
}

interface OnboardingFormValues {
  rank: string;
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

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen }) => {
  const updateProfileMutation = useUpdateProfile();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OnboardingFormValues>({
    defaultValues: {
      rank: '',
      signOnDate: '',
    },
  });

  const onSubmit = async (data: OnboardingFormValues) => {
    setErrorMsg(null);
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
        rank: data.rank,
        signOnDate: new Date(data.signOnDate).toISOString(),
      });
      toast.success('Profile onboarded successfully! Welcome aboard.');
    } catch (e: any) {
      const msg = e.response?.data?.message || 'Failed to complete profile onboarding.';
      setErrorMsg(msg);
      toast.error(msg);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Non-clickable modal backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/85 backdrop-blur-md"
          />

          {/* Onboarding Form Box */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-2xl z-50 overflow-hidden"
          >
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-12 h-12 bg-sky-950 border border-sky-500 rounded-2xl flex items-center justify-center text-sky-400 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-.778.099-1.533.284-2.253" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-zinc-100 tracking-tight">Complete Crew Profile</h3>
              <p className="text-xs text-zinc-400 mt-1 max-w-sm">
                Welcome! Please supply your rank and sign-on details to fetch safety templates and activate your vessel context.
              </p>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-955/20 border border-red-900/40 rounded-xl text-xs text-red-400 font-medium mb-4">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
              <FormSelect
                label="Assign Deck Rank"
                options={[
                  { value: '', label: 'Select Rank...' },
                  ...RANK_OPTIONS
                ]}
                error={errors.rank?.message}
                disabled={updateProfileMutation.isPending}
                {...register('rank')}
              />

              <DatePicker
                label="Vessel Sign-on Date"
                error={errors.signOnDate?.message}
                disabled={updateProfileMutation.isPending}
                {...register('signOnDate')}
              />

              <button
                type="submit"
                disabled={updateProfileMutation.isPending}
                className="w-full font-bold px-4 py-3 rounded-xl bg-sky-950 hover:bg-sky-900/40 border border-sky-800 text-sky-400 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {updateProfileMutation.isPending ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-sky-400" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Saving Profile...</span>
                  </>
                ) : (
                  'Complete & Unlock Workspace'
                )}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default OnboardingModal;
