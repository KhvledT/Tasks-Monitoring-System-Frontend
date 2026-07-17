import React, { createContext, useState } from 'react';
import type { Vessel } from '../features/vessel/types/vessel.types';

export interface VesselContextType {
  activeVessel: Vessel | null;
  activeVesselId: string | null;
  isCheckingVessel: boolean;
  setActiveVessel: (vessel: Vessel | null) => void;
  setIsCheckingVessel: (checking: boolean) => void;
}

export const VesselContext = createContext<VesselContextType | undefined>(undefined);

export const VesselProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeVessel, setActiveVesselState] = useState<Vessel | null>(null);
  const [isCheckingVessel, setIsCheckingVessel] = useState<boolean>(true);

  const setActiveVessel = (vessel: Vessel | null) => {
    setActiveVesselState(vessel);
  };

  // Convert Mongo _id or standard id to string activeVesselId
  const activeVesselId = activeVessel 
    ? ((activeVessel as any)._id || activeVessel.id || null) 
    : null;

  return (
    <VesselContext.Provider
      value={{
        activeVessel,
        activeVesselId,
        isCheckingVessel,
        setActiveVessel,
        setIsCheckingVessel,
      }}
    >
      {children}
    </VesselContext.Provider>
  );
};
export default VesselProvider;
