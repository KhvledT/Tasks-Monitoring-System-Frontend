import React from "react";
import { QRCodeSVG } from "qrcode.react";
import { useActiveVessel } from "../../../shared/hooks/useActiveVessel";
import { toast } from "react-hot-toast";

export const QrInvitePage: React.FC = () => {
  const { activeVessel } = useActiveVessel();

  const inviteCode = activeVessel?.inviteCode || "INV-SAMPLE88";
  const joinUrl = `${window.location.origin}/select-vessel?passcode=${inviteCode}`;

  const copyInviteLink = () => {
    navigator.clipboard.writeText(joinUrl);
    toast.success("Joining URL copied to clipboard!");
  };

  const copyInviteCode = () => {
    navigator.clipboard.writeText(inviteCode);
    toast.success("Invite Passcode copied to clipboard!");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-6 font-sans max-w-xl mx-auto text-center">
      <div className="bg-white border border-zinc-200 rounded-3xl p-8 shadow-md flex flex-col items-center gap-6 w-full">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-purple-600 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
            Official Vessel Joining Pass
          </span>
          <h1 className="text-2xl font-extrabold text-black mt-3">
            {activeVessel?.name || "VIP Vessel"}
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Scan this official QR Code with your camera or enter the passcode to apply for shipboard crew access.
          </p>
        </div>

        {/* Real Scannable SVG QR Code */}
        <div className="p-4 bg-white border-2 border-purple-200 rounded-3xl shadow-lg flex flex-col items-center gap-2">
          <div className="p-3 bg-zinc-950 rounded-2xl">
            <QRCodeSVG
              value={joinUrl}
              size={200}
              bgColor="#09090b"
              fgColor="#ffffff"
              level="H"
              includeMargin={true}
            />
          </div>
          <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest mt-1">
            Scannable Operational Pass
          </span>
        </div>

        {/* Invite Passcode Box */}
        <div className="flex flex-col gap-1 w-full bg-zinc-50 border border-zinc-200 p-4 rounded-2xl">
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
            Joining Passcode
          </span>
          <span className="text-2xl font-mono font-extrabold text-black tracking-widest">
            {inviteCode}
          </span>
          <span className="text-[10px] font-mono text-purple-600 truncate mt-1">
            {joinUrl}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
          <button
            onClick={copyInviteLink}
            className="py-3 bg-purple-600 hover:bg-purple-700 text-xs font-extrabold text-white rounded-xl transition cursor-pointer shadow-sm"
          >
            📋 Copy Joining Link
          </button>
          <button
            onClick={copyInviteCode}
            className="py-3 bg-primary hover:bg-[#003fa3] text-xs font-extrabold text-white rounded-xl transition cursor-pointer shadow-sm"
          >
            🔑 Copy Passcode Only
          </button>
        </div>

        <button
          onClick={() => window.print()}
          className="w-full py-2.5 bg-zinc-100 hover:bg-zinc-200 border border-zinc-300 text-xs font-bold text-zinc-700 rounded-xl transition cursor-pointer"
        >
          🖨️ Print / Save Official Pass
        </button>
      </div>
    </div>
  );
};

export default QrInvitePage;
