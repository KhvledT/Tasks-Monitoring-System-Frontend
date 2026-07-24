import React from "react";
import { Link } from "react-router";
import { useActiveVessel } from "../shared/hooks/useActiveVessel";
import { ROUTES } from "../constants/routes";

interface VesselOperationalGuardProps {
  children: React.ReactNode;
}

export const VesselOperationalGuard: React.FC<VesselOperationalGuardProps> = ({ children }) => {
  const { activeVessel, viewedVessel, isCheckingVessel } = useActiveVessel();

  if (isCheckingVessel) {
    return (
      <div className="p-12 text-center text-xs text-zinc-400 font-mono italic">
        Verifying vessel workspace status...
      </div>
    );
  }

  const currentVessel = viewedVessel || activeVessel;

  if (!currentVessel) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center p-6 font-sans">
        <div className="bg-white border border-zinc-200 rounded-3xl p-8 max-w-lg w-full text-center shadow-xl flex flex-col items-center gap-5">
          <div className="w-16 h-16 rounded-full bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center text-3xl shadow-xs">
            ⚓
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-extrabold uppercase text-amber-800 bg-amber-100 px-3 py-0.5 rounded-full border border-amber-300 w-max mx-auto">
              No Vessel Selected
            </span>
            <h2 className="text-xl font-extrabold text-black tracking-tight mt-1">
              Select Vessel Workspace
            </h2>
            <p className="text-xs text-zinc-500 leading-relaxed mt-0.5">
              You currently have no active vessel workspace selected. Please choose a vessel to enter the operational command center or inspect historical logbooks.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full pt-2">
            <Link
              to={ROUTES.SELECT_VESSEL}
              className="w-full sm:flex-1 py-3 bg-[#0055d4] hover:bg-[#003fa3] text-white font-extrabold text-xs rounded-xl shadow-sm transition text-center"
            >
              ⚓ Select Vessel Workspace
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default VesselOperationalGuard;
