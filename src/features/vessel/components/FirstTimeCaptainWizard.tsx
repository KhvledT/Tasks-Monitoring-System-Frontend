import React, { useState } from "react";
import { vesselApi } from "../api/vessel.api";
import { toast } from "react-hot-toast";

interface FirstTimeCaptainWizardProps {
  isOpen: boolean;
  onComplete: () => void;
}

export const FirstTimeCaptainWizard: React.FC<FirstTimeCaptainWizardProps> = ({
  isOpen,
  onComplete,
}) => {
  const [step, setStep] = useState(1);
  const [vesselName, setVesselName] = useState("");
  const [vesselType, setVesselType] = useState("Container");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleCreateVessel = async () => {
    if (!vesselName.trim()) {
      toast.error("Please enter a vessel name.");
      return;
    }

    setIsSubmitting(true);
    try {
      await vesselApi.createVessel({
        name: vesselName.trim(),
        type: vesselType,
        vesselMode: "VIP",
      });
      toast.success(`VIP Vessel "${vesselName}" created successfully as Captain!`);
      setStep(3);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to provision VIP vessel.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in font-sans">
      <div className="bg-white border border-zinc-200 rounded-3xl w-full max-w-lg p-8 shadow-2xl flex flex-col gap-6">
        {/* Progress Bar */}
        <div className="flex items-center justify-between border-b border-zinc-150 pb-4">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-sky-600 bg-sky-50 px-2.5 py-0.5 rounded border border-sky-200">
              Welcome, Captain!
            </span>
            <h3 className="text-xl font-extrabold text-black tracking-tight mt-1">
              First-Time Captain Setup Wizard
            </h3>
          </div>
          <span className="text-xs font-mono font-bold text-zinc-400">Step {step} of 3</span>
        </div>

        {/* Step 1: Welcome & Overview */}
        {step === 1 && (
          <div className="flex flex-col gap-4">
            <div className="p-4 bg-sky-50/60 border border-sky-100 rounded-2xl flex items-start gap-3">
              <div className="text-2xl">⚓</div>
              <div>
                <h4 className="text-xs font-bold text-sky-950 uppercase tracking-wider">
                  You Have Been Promoted to Captain!
                </h4>
                <p className="text-xs text-sky-700 mt-1 leading-relaxed">
                  As a Captain, you are authorized to provision and command VIP vessels, generate shipboard invite codes, approve joining crew members, and manage checklists.
                </p>
              </div>
            </div>

            <p className="text-xs text-zinc-500">
              Let&apos;s guide you through creating your first VIP vessel command workspace.
            </p>

            <button
              onClick={() => setStep(2)}
              className="w-full py-3 bg-[#0055d4] hover:bg-[#003fa3] text-xs font-extrabold text-white rounded-xl transition cursor-pointer shadow-md mt-2"
            >
              Get Started & Create Vessel &rarr;
            </button>
          </div>
        )}

        {/* Step 2: Vessel Creation Form */}
        {step === 2 && (
          <div className="flex flex-col gap-4">
            <h4 className="text-xs font-bold text-black uppercase tracking-wider">
              Provision Your First VIP Vessel
            </h4>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-zinc-500">Vessel Name</label>
              <input
                type="text"
                placeholder="e.g. Pacific Explorer"
                value={vesselName}
                onChange={(e) => setVesselName(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-200 px-3.5 py-2.5 text-xs font-semibold rounded-xl text-black focus:outline-none focus:border-sky-500"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-zinc-500">Vessel Type</label>
              <select
                value={vesselType}
                onChange={(e) => setVesselType(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-200 px-3.5 py-2.5 text-xs font-semibold rounded-xl text-black cursor-pointer"
              >
                <option value="Container">Container Vessel</option>
                <option value="Tanker">Oil / Chemical Tanker</option>
                <option value="Bulk Carrier">Bulk Carrier</option>
                <option value="LPG">LPG / LNG Carrier</option>
                <option value="General Cargo">General Cargo</option>
              </select>
            </div>

            <div className="flex items-center gap-3 mt-4">
              <button
                onClick={handleCreateVessel}
                disabled={isSubmitting || !vesselName.trim()}
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-xs font-extrabold text-white rounded-xl transition cursor-pointer shadow-md"
              >
                {isSubmitting ? "Provisioning..." : "Provision VIP Vessel"}
              </button>
              <button
                onClick={() => setStep(1)}
                className="px-4 py-3 bg-zinc-100 text-xs font-bold text-black rounded-xl hover:bg-zinc-200 cursor-pointer"
              >
                Back
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Success & Next Steps */}
        {step === 3 && (
          <div className="flex flex-col gap-4 text-center">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center font-extrabold text-2xl mx-auto border border-emerald-200">
              ✓
            </div>
            <h4 className="text-lg font-extrabold text-black">Vessel Command Workspace Ready!</h4>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Your VIP vessel <strong>{vesselName}</strong> is operational. You can now generate invitation codes and onboard your officers.
            </p>

            <button
              onClick={onComplete}
              className="w-full py-3 bg-[#0055d4] hover:bg-[#003fa3] text-xs font-extrabold text-white rounded-xl transition cursor-pointer shadow-md mt-2"
            >
              Enter Captain Command Portal &rarr;
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FirstTimeCaptainWizard;
