import React, { useEffect, useRef } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import type { IssueFormValues } from '../hooks/useIssueForm';
import type { AvailableTaskOption } from '../types/issue.types';
import { motion, AnimatePresence } from 'framer-motion';

interface CreateIssueModalProps {
  isOpen: boolean;
  isLoading: boolean;
  errorMsg: string | null;
  taskOptions: AvailableTaskOption[];
  form: UseFormReturn<IssueFormValues>;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export const CreateIssueModal: React.FC<CreateIssueModalProps> = ({
  isOpen,
  isLoading,
  errorMsg,
  taskOptions,
  form,
  onSubmit,
  onCancel,
}) => {
  const { register, watch, setValue, formState: { errors } } = form;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageUrlValue = watch('imageUrl');

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 100 * 1024 * 1024) {
      alert('Image size must be less than 100MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Str = event.target?.result as string;
      if (base64Str) {
        setValue('imageUrl', base64Str);
      }
    };
    reader.readAsDataURL(file);
  };

  // Escape key handler to close the modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCancel();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onCancel]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-2xl z-50 overflow-hidden"
          >
            <div className="flex items-center justify-between border-b border-zinc-900 pb-4 mb-5">
              <div>
                <h3 className="text-base font-bold text-zinc-100 tracking-tight">Register New Issue</h3>
                <p className="text-xs text-zinc-400 mt-0.5">Link a defect to a task execution record for audit.</p>
              </div>
              <button
                onClick={onCancel}
                className="p-1 rounded-lg text-zinc-500 hover:bg-zinc-900 hover:text-zinc-200 transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={onSubmit} className="flex flex-col gap-4">
              {errorMsg && (
                <div className="p-3 bg-red-950/20 border border-red-900/40 rounded-xl text-xs text-red-400 font-medium">
                  {errorMsg}
                </div>
              )}

              {/* Linked TaskDropdown */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-zinc-450">
                  Linked Task Record <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('taskRecordId')}
                  disabled={isLoading}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-800 bg-zinc-900/40 text-zinc-250 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-sky-500/50 hover:bg-zinc-900/60 transition cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
                >
                  <option value="" className="bg-zinc-950 text-zinc-400">
                    -- Select a Task --
                  </option>
                  {taskOptions.map((opt) => (
                    <option key={opt.id} value={opt.id} className="bg-zinc-950 text-zinc-200">
                      [{opt.categoryName || 'General'}] {opt.title} ({opt.status})
                    </option>
                  ))}
                </select>
                {errors.taskRecordId && (
                  <span className="text-[11px] text-red-400 font-medium mt-0.5">
                    {errors.taskRecordId.message}
                  </span>
                )}
              </div>

              {/* Machinery Department Taxonomy Dropdown */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-zinc-450">
                  Shipboard Department / Equipment Taxonomy <span className="text-red-500">*</span>
                </label>
                <select
                  disabled={isLoading}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-800 bg-zinc-900/40 text-zinc-250 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-sky-500/50 hover:bg-zinc-900/60 transition cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
                >
                  <option value="Main Engine" className="bg-zinc-950 text-zinc-200">Main Engine (Propulsion)</option>
                  <option value="Auxiliary Engine" className="bg-zinc-950 text-zinc-200">Auxiliary Generators</option>
                  <option value="Purifiers & Fuel" className="bg-zinc-950 text-zinc-200">Purifiers & Fuel System</option>
                  <option value="Boiler & Steam" className="bg-zinc-950 text-zinc-200">Boiler & Auxiliary Steam</option>
                  <option value="Deck & Steering" className="bg-zinc-950 text-zinc-200">Deck Machinery & Steering Gear</option>
                  <option value="Electrical System" className="bg-zinc-950 text-zinc-200">Electrical & Switchboards</option>
                </select>
              </div>

              {/* Severity Dropdown */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-zinc-450">
                  Operational Severity <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('severity')}
                  disabled={isLoading}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-800 bg-zinc-900/40 text-zinc-250 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-sky-500/50 hover:bg-zinc-900/60 transition cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
                >
                  <option value="MINOR" className="bg-zinc-950 text-zinc-200">MINOR (Slight defect / maintenance log)</option>
                  <option value="MAJOR" className="bg-zinc-950 text-zinc-200">MAJOR (Defect requires attention)</option>
                  <option value="CRITICAL" className="bg-zinc-950 text-zinc-200">CRITICAL (Vessel safety/operation risk)</option>
                  <option value="OBSERVATION" className="bg-zinc-950 text-zinc-200">OBSERVATION (General audit observation)</option>
                </select>
                {errors.severity && (
                  <span className="text-[11px] text-red-400 font-medium mt-0.5">
                    {errors.severity.message}
                  </span>
                )}
              </div>

              {/* Description Input */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-zinc-450">
                  Defect Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  {...register('description')}
                  disabled={isLoading}
                  placeholder="Describe the leak, warning alarms, or damage found..."
                  rows={3}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-800 bg-zinc-900/40 text-zinc-200 text-xs font-medium placeholder-zinc-650 transition focus:outline-none focus:ring-2 focus:ring-sky-500/50 hover:bg-zinc-900/60 resize-none disabled:opacity-50 disabled:pointer-events-none"
                />
                {errors.description && (
                  <span className="text-[11px] text-red-400 font-medium mt-0.5">
                    {errors.description.message}
                  </span>
                )}
              </div>

              {/* Notes Input */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-zinc-450">Notes / Comments</label>
                <textarea
                  {...register('note')}
                  disabled={isLoading}
                  placeholder="e.g. Chief Engineer notified. Spare parts requested."
                  rows={2}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-800 bg-zinc-900/40 text-zinc-200 text-xs font-medium placeholder-zinc-650 transition focus:outline-none focus:ring-2 focus:ring-sky-500/50 hover:bg-zinc-900/60 resize-none disabled:opacity-50 disabled:pointer-events-none"
                />
                {errors.note && (
                  <span className="text-[11px] text-red-400 font-medium mt-0.5">
                    {errors.note.message}
                  </span>
                )}
              </div>

              {/* Image Upload / Attachment */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-zinc-450 flex items-center justify-between">
                  <span>Photo Attachment / Evidence</span>
                  <span className="text-[10px] text-zinc-550 font-normal italic">(Optional)</span>
                </label>

                {imageUrlValue ? (
                  <div className="relative w-full h-32 rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden group">
                    <img src={imageUrlValue} alt="Defect Evidence Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setValue('imageUrl', '')}
                      className="absolute top-2 right-2 p-1.5 bg-black/80 hover:bg-black text-white rounded-lg transition"
                      title="Remove attachment"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-4 border-2 border-dashed border-zinc-800 hover:border-sky-500/50 bg-zinc-900/30 hover:bg-zinc-900/60 rounded-xl flex flex-col items-center justify-center gap-1.5 cursor-pointer transition"
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileSelect}
                      accept="image/*"
                      className="hidden"
                    />
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-6 h-6 text-sky-400">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                    </svg>
                    <span className="text-xs font-bold text-zinc-300">Click to upload photo evidence</span>
                    <span className="text-[10px] text-zinc-550">PNG, JPG, WEBP (Max 100MB)</span>
                  </div>
                )}
                {errors.imageUrl && (
                  <span className="text-[11px] text-red-400 font-medium mt-0.5">
                    {errors.imageUrl.message}
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 border-t border-zinc-900 pt-4 mt-2">
                <button
                  type="button"
                  onClick={onCancel}
                  disabled={isLoading}
                  className="px-4 py-2.5 border border-zinc-850 hover:bg-zinc-900 text-zinc-350 hover:text-zinc-200 text-xs font-semibold rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2.5 bg-sky-950 text-sky-400 hover:bg-sky-900/35 border border-sky-900/60 text-xs font-semibold rounded-xl transition flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50 cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-3.5 w-3.5 text-sky-400" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>Submitting...</span>
                    </>
                  ) : (
                    'Submit Issue'
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

export default CreateIssueModal;
