import { useContext } from 'react';
import { VesselContext, type VesselContextType } from '../../providers/VesselProvider';

export const useActiveVessel = (): VesselContextType => {
  const context = useContext(VesselContext);
  if (!context) {
    throw new Error('useActiveVessel must be used within a VesselProvider');
  }
  return context;
};
