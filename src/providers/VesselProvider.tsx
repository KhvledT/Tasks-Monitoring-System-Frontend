import React, { createContext, useState, useEffect } from 'react';
import type { Vessel } from '../features/vessel/types/vessel.types';

export interface VesselContextType {
  activeVessel: Vessel | null;
  activeVesselId: string | null;
  viewedVesselId: string | null;
  vesselName: string;
  vesselType: string;
  vesselMode: "Personal" | "VIP";
  vesselStatus: "Active" | "Draft" | "Maintenance" | "Suspended" | "Archived";
  userRank: string;
  hasRequestedLeave: boolean;
  isOffboarded: boolean;
  isOperationalActive: boolean;
  isCheckingVessel: boolean;
  setActiveVessel: (vessel: Vessel | null) => void;
  switchActiveVessel: (vessel: Vessel | null) => void;
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
    if (vessel) {
      const vId = (vessel as any)._id || vessel.id;
      localStorage.setItem("mtms_active_vessel_id", vId);
    } else {
      localStorage.removeItem("mtms_active_vessel_id");
    }
  };

  const switchActiveVessel = (vessel: Vessel | null) => {
    setActiveVessel(vessel);
  };

  const isArchiveMode = !!(
    viewedVessel &&
    activeVessel &&
    ((viewedVessel as any)._id || viewedVessel.id) !== ((activeVessel as any)._id || activeVessel.id)
  );

  const activeVesselId = activeVessel ? ((activeVessel as any)._id || activeVessel.id || null) : null;

  const viewedVesselId = viewedVessel 
    ? ((viewedVessel as any)._id || viewedVessel.id || null) 
    : activeVesselId;

  const currentTargetVessel = viewedVessel || activeVessel;
  const vesselName = currentTargetVessel?.name || "No Active Vessel";
  const vesselType = currentTargetVessel?.type || "Unassigned";
  const vesselMode = (currentTargetVessel?.vesselMode as any) || "Personal";
  const vesselStatus = (currentTargetVessel?.vesselStatus as any) || (currentTargetVessel?.isActive ? "Active" : "Draft");
  const userRank = (currentTargetVessel as any)?.userRank || "Officer";
  const isOffboarded = !!(currentTargetVessel as any)?.isOffboarded;
  const hasRequestedLeave = !!(currentTargetVessel as any)?.hasRequestedLeave || isOffboarded;
  
  // Operational if status is Active or isActive flag is set AND user has not submitted a leave request or been offboarded
  const isOperationalActive = !!(
    currentTargetVessel &&
    (currentTargetVessel.vesselStatus === "Active" || currentTargetVessel.isActive) &&
    currentTargetVessel.vesselStatus !== "Draft" &&
    currentTargetVessel.vesselStatus !== "Maintenance" &&
    currentTargetVessel.vesselStatus !== "Suspended" &&
    currentTargetVessel.vesselStatus !== "Archived" &&
    !hasRequestedLeave &&
    !isOffboarded
  );

  return (
    <VesselContext.Provider
      value={{
        activeVessel,
        activeVesselId,
        viewedVesselId,
        vesselName,
        vesselType,
        vesselMode,
        vesselStatus,
        userRank,
        hasRequestedLeave,
        isOffboarded,
        isOperationalActive,
        isCheckingVessel,
        setActiveVessel,
        switchActiveVessel,
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
