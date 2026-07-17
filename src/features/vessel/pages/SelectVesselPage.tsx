import React, { useState } from 'react';
import { useVessels } from '../hooks/useVessels';
import { useCreateVessel } from '../hooks/useCreateVessel';
import { useActivateVessel } from '../hooks/useActivateVessel';
import { VesselHeader } from '../components/VesselHeader';
import { VesselGrid } from '../components/VesselGrid';
import { VesselForm } from '../components/VesselForm';
import { motion, AnimatePresence } from 'framer-motion';
import type { CreateVesselFormValues } from '../schemas/vessel.schema';

export const SelectVesselPage: React.FC = () => {
  const { data: vessels, isLoading, error } = useVessels();
  const { mutateAsync: createVessel, isPending: isCreating } = useCreateVessel();
  const { mutateAsync: activateVessel, isPending: isActivating, variables: activatingId } = useActivateVessel();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const handleActivate = async (id: string) => {
    try {
      await activateVessel(id);
    } catch (e: any) {
      console.error('Activation failed:', e);
    }
  };

  const handleCreateSubmit = async (values: CreateVesselFormValues) => {
    setFormError(null);
    try {
      const response = await createVessel({
        name: values.name,
        type: values.type,
        grt: values.grt,
        dwt: values.dwt,
      });

      setSuccessToast(`Vessel "${response.result.name}" created successfully!`);
      setIsModalOpen(false);

      // Auto-dismiss toast
      setTimeout(() => setSuccessToast(null), 4000);
    } catch (e: any) {
      const backendMessage = e.response?.data?.message || 'Failed to register vessel';
      setFormError(backendMessage);
    }
  };

  return (
    <div className="w-full relative min-h-[400px]">
      <VesselHeader
        onRegisterClick={() => setIsModalOpen(true)}
        showRegisterBtn={vessels && vessels.length > 0 ? true : false}
      />

      {error && (
        <div className="p-4 mb-6 bg-red-950/20 border border-red-900/50 rounded-xl text-sm text-red-400">
          Failed to load vessels. Please check your network connection and try again.
        </div>
      )}

      <VesselGrid
        vessels={vessels}
        isLoading={isLoading}
        isActivatingId={isActivating ? (activatingId as string) : null}
        onActivate={handleActivate}
        onRegisterClick={() => setIsModalOpen(true)}
      />

      {/* Success Toast Notification */}
      <AnimatePresence>
        {successToast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 px-4 py-3 bg-zinc-900 border border-emerald-500/30 text-emerald-400 text-sm font-semibold rounded-xl shadow-2xl flex items-center gap-2 z-50"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            {successToast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Register New Vessel Modal Dialog */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Modal Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal Dialog Content Container */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-2xl z-50 overflow-hidden"
            >
              <div className="flex items-center justify-between border-b border-zinc-900 pb-4 mb-6">
                <div>
                  <h3 className="text-lg font-bold text-zinc-100 tracking-tight">Register New Vessel</h3>
                  <p className="text-xs text-zinc-400">Add details of the vessel to your watch workspace.</p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 rounded-lg text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200 transition"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <VesselForm
                onSubmit={handleCreateSubmit}
                isLoading={isCreating}
                errorMsg={formError}
                onCancel={() => setIsModalOpen(false)}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
export default SelectVesselPage;
