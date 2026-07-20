import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ROUTES } from '../../../constants/routes';
import { useVessels } from '../hooks/useVessels';
import { useCreateVessel } from '../hooks/useCreateVessel';
import { useActivateVessel } from '../hooks/useActivateVessel';
import { useUpdateVessel } from '../hooks/useUpdateVessel';
import { useDeleteVessel } from '../hooks/useDeleteVessel';
import { useActiveVessel } from '../../../shared/hooks/useActiveVessel';
import { VesselHeader } from '../components/VesselHeader';
import { VesselGrid } from '../components/VesselGrid';
import { VesselForm } from '../components/VesselForm';
import { OnboardingModal } from '../components/OnboardingModal';
import { useCurrentUser } from '../../auth/hooks/useCurrentUser';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import type { CreateVesselFormValues } from '../schemas/vessel.schema';
import type { Vessel } from '../types/vessel.types';

export const SelectVesselPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: vessels, isLoading, error } = useVessels();
  const { mutateAsync: createVessel, isPending: isCreating } = useCreateVessel();
  const { mutateAsync: activateVessel, isPending: isActivating, variables: activatingId } = useActivateVessel();
  const { mutateAsync: updateVessel, isPending: isUpdating } = useUpdateVessel();
  const { mutateAsync: deleteVessel, isPending: isDeleting, variables: deletingId } = useDeleteVessel();
  const { setActiveVessel, setViewedVessel } = useActiveVessel();

  const currentUser = useCurrentUser();
  const isOnboardingPending = currentUser?.rank === 'PENDING_ONBOARDING';

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVessel, setEditingVessel] = useState<Vessel | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // Escape key handler to close the modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsModalOpen(false);
        setEditingVessel(null);
        setFormError(null);
      }
    };
    if (isModalOpen || !!editingVessel) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isModalOpen, editingVessel]);

  const handleActivate = async (id: string) => {
    try {
      await activateVessel(id);
    } catch (e: any) {
      console.error('Activation failed:', e);
    }
  };

  const handleViewArchive = (vessel: Vessel) => {
    setViewedVessel(vessel);
    navigate(ROUTES.DASHBOARD);
  };

  const handleFormSubmit = async (values: CreateVesselFormValues) => {
    setFormError(null);
    try {
      if (editingVessel) {
        const id = (editingVessel as any)._id || editingVessel.id;
        await updateVessel({
          vesselId: id,
          data: {
            name: values.name,
            type: values.type,
            grt: values.grt,
            dwt: values.dwt,
          },
        });
        toast.success(`Vessel "${values.name}" updated successfully!`);
        setEditingVessel(null);
      } else {
        const response = await createVessel({
          name: values.name,
          type: values.type,
          grt: values.grt,
          dwt: values.dwt,
        });
        toast.success(`Vessel "${response.result.name}" registered successfully!`);
        setIsModalOpen(false);
      }
    } catch (e: any) {
      const backendMessage = e.response?.data?.message || 'Failed to save vessel';
      setFormError(backendMessage);
    }
  };

  const handleDelete = async (id: string, isActive: boolean) => {
    if (!window.confirm("Are you sure you want to delete this vessel? This will permanently delete all checklist history and defect logs associated with it.")) {
      return;
    }

    try {
      await deleteVessel(id);
      toast.success("Vessel deleted successfully!");
      if (isActive) {
        setActiveVessel(null);
      }
    } catch (e: any) {
      const msg = e.response?.data?.message || "Failed to delete vessel.";
      toast.error(msg);
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
        isDeletingId={isDeleting ? (deletingId as string) : null}
        onActivate={handleActivate}
        onViewArchive={handleViewArchive}
        onRegisterClick={() => setIsModalOpen(true)}
        onEdit={(vessel) => {
          setFormError(null);
          setEditingVessel(vessel);
        }}
        onDelete={handleDelete}
      />



      {/* Register/Edit Vessel Modal Dialog */}
      <AnimatePresence>
        {(isModalOpen || !!editingVessel) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Modal Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setIsModalOpen(false);
                setEditingVessel(null);
                setFormError(null);
              }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal Dialog Content Container */}
            <motion.div
              key={editingVessel ? `edit-${(editingVessel as any)._id || editingVessel.id}` : 'register'}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-2xl z-50 overflow-hidden"
            >
              <div className="flex items-center justify-between border-b border-zinc-900 pb-4 mb-6">
                <div>
                  <h3 className="text-lg font-bold text-zinc-100 tracking-tight">
                    {editingVessel ? 'Edit Vessel Specifications' : 'Register New Vessel'}
                  </h3>
                  <p className="text-xs text-zinc-400">
                    {editingVessel ? 'Modify the selected vessel options.' : 'Add details of the vessel to your watch workspace.'}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingVessel(null);
                    setFormError(null);
                  }}
                  className="p-1.5 rounded-lg text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200 transition"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <VesselForm
                vessel={editingVessel || undefined}
                onSubmit={handleFormSubmit}
                isLoading={isCreating || isUpdating}
                errorMsg={formError}
                onCancel={() => {
                  setIsModalOpen(false);
                  setEditingVessel(null);
                  setFormError(null);
                }}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <OnboardingModal isOpen={isOnboardingPending} />
    </div>
  );
};
export default SelectVesselPage;
