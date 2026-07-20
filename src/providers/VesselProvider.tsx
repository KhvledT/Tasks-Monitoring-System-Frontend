import React, { createContext, useState, useEffect } from 'react';
import type { Vessel } from '../features/vessel/types/vessel.types';

export interface VesselContextType {
  activeVessel: Vessel | null;
  activeVesselId: string | null;
  isCheckingVessel: boolean;
  setActiveVessel: (vessel: Vessel | null) => void;
  setIsCheckingVessel: (checking: boolean) => void;
  // Archive Workspace support
  viewedVessel: Vessel | null;
  isArchiveMode: boolean;
  setViewedVessel: (vessel: Vessel | null) => void;
}

export const VesselContext = createContext<VesselContextType | undefined>(undefined);

export const VesselProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeVessel, setActiveVesselState] = useState<Vessel | null>(null);
  const [viewedVessel, setViewedVessel] = useState<Vessel | null>(null);
  const [isCheckingVessel, setIsCheckingVessel] = useState<boolean>(true);

  // Automatically sync viewedVessel with activeVessel when activeVessel is loaded
  useEffect(() => {
    if (activeVessel) {
      setViewedVessel(activeVessel);
    } else {
      setViewedVessel(null);
    }
  }, [activeVessel]);

  const setActiveVessel = (vessel: Vessel | null) => {
    setActiveVesselState(vessel);
  };

  const isArchiveMode = !!(
    viewedVessel &&
    activeVessel &&
    ((viewedVessel as any)._id || viewedVessel.id) !== ((activeVessel as any)._id || activeVessel.id)
  );

  // If in archive mode, return the viewed vessel's ID so queries load its data.
  // Otherwise, return the active vessel's ID.
  const activeVesselId = viewedVessel 
    ? ((viewedVessel as any)._id || viewedVessel.id || null) 
    : (activeVessel ? ((activeVessel as any)._id || activeVessel.id || null) : null);

  return (
    <VesselContext.Provider
      value={{
        activeVessel,
        activeVesselId,
        isCheckingVessel,
        setActiveVessel,
        setIsCheckingVessel,
        viewedVessel,
        isArchiveMode,
        setViewedVessel,
      }}
    >
      {children}
    </VesselContext.Provider>
  );
};

export default VesselProvider;
