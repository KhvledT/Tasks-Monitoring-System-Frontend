import React from "react";
import { Card } from "@heroui/react";
import { motion } from "framer-motion";

interface SessionInfoCardProps {}

export const SessionInfoCard: React.FC<SessionInfoCardProps> = () => {
  const getDeviceLabel = () => {
    const ua = navigator.userAgent;
    if (/android/i.test(ua)) return "Android Device";
    if (/iPad|iPhone|iPod/.test(ua)) return "iOS Device";
    if (/mac/i.test(ua)) return "macOS Workstation";
    if (/win/i.test(ua)) return "Windows Workstation";
    if (/linux/i.test(ua)) return "Linux Station";
    return "Web Console";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.05 }}
    >
      <Card className="border border-zinc-200 bg-white p-6 rounded-2xl shadow-sm h-full">
        <h3 className="text-sm font-bold text-gray-900 tracking-tight mb-4">
          Active Sessions
        </h3>

        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-zinc-150">
              <th className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider pb-2">
                Device / Location
              </th>
              <th className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider pb-2">
                IP Address
              </th>
              <th className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider pb-2">
                Last Active
              </th>
              <th className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider pb-2">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-zinc-100">
              <td className="py-3 text-xs text-gray-800 font-semibold">
                {getDeviceLabel()} (Current)
              </td>
              <td className="py-3 text-xs text-zinc-500 font-mono">
                {window.location.hostname || "Client Session"}
              </td>
              <td className="py-3 text-xs text-zinc-500">Active Now</td>
              <td className="py-3">
                <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 border border-emerald-200">
                  ACTIVE
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </Card>
    </motion.div>
  );
};

export default SessionInfoCard;
