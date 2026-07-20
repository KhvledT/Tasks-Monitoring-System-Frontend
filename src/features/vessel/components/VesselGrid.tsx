import React from 'react';
import type { Vessel } from '../types/vessel.types';
import { VesselCard } from './VesselCard';
import { EmptyVesselState } from './EmptyVesselState';

interface VesselGridProps {
  vessels: Vessel[] | undefined;
  isLoading: boolean;
  isActivatingId: string | null;
  isDeletingId: string | null;
  onActivate: (id: string) => void;
  onViewArchive: (vessel: Vessel) => void;
  onRegisterClick: () => void;
  onEdit: (vessel: Vessel) => void;
  onDelete: (id: string, isActive: boolean) => void;
}

export const VesselGrid: React.FC<VesselGridProps> = ({
  vessels,
  isLoading,
  isActivatingId,
  isDeletingId,
  onActivate,
  onViewArchive,
  onRegisterClick,
  onEdit,
  onDelete,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((idx) => (
          <div key={idx} className="border border-zinc-800 bg-zinc-950/30 rounded-2xl p-6 flex flex-col justify-between h-[190px] animate-pulse">
            <div>
              <div className="h-6 w-2/3 bg-zinc-800 rounded mb-3" />
              <div className="h-4 w-1/4 bg-zinc-850 rounded mb-6" />
            </div>
            <div className="h-10 w-full bg-zinc-800 rounded-xl" />
          </div>
        ))}
      </div>
    );
  }

  if (!vessels || vessels.length === 0) {
    return <EmptyVesselState onRegisterClick={onRegisterClick} />;
  }

  const anyActionPending = !!isActivatingId || !!isDeletingId;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {vessels.map((vessel) => {
        const id = (vessel as any)._id || vessel.id;
        return (
          <VesselCard
            key={id}
            vessel={vessel}
            isActivating={isActivatingId === id}
            isDeleting={isDeletingId === id}
            anyActionPending={anyActionPending}
            onActivate={onActivate}
            onViewArchive={onViewArchive}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        );
      })}
    </div>
  );
};
export default VesselGrid;
