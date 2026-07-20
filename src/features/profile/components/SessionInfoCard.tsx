import React from 'react';
import { Card } from '@heroui/react';
import { motion } from 'framer-motion';

interface SessionInfoCardProps {}

export const SessionInfoCard: React.FC<SessionInfoCardProps> = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.05 }}
    >
      <Card className="border border-zinc-900 bg-zinc-950/40 p-6 rounded-2xl backdrop-blur-md h-full">
        <h3 className="text-sm font-bold text-zinc-200 tracking-tight mb-4">Active Sessions</h3>

        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-zinc-900/50">
              <th className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider pb-2">Device / Location</th>
              <th className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider pb-2">IP Address</th>
              <th className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider pb-2">Last Active</th>
              <th className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider pb-2">Status</th>
              <th className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider pb-2"></th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-zinc-900/30">
              <td className="py-3 text-xs text-zinc-200">Bridge Console 04</td>
              <td className="py-3 text-xs text-zinc-500 font-mono">192.168.1.45</td>
              <td className="py-3 text-xs text-zinc-400">Current</td>
              <td className="py-3">
                <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">ACTIVE</span>
              </td>
              <td className="py-3"></td>
            </tr>
            <tr>
              <td className="py-3 text-xs text-zinc-200">iPhone 14 Pro</td>
              <td className="py-3 text-xs text-zinc-500 font-mono">10.0.0.12</td>
              <td className="py-3 text-xs text-zinc-400">3 hours ago</td>
              <td className="py-3">
                <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">IDLE</span>
              </td>
              <td className="py-3">
                <button className="text-[10px] text-red-400 hover:text-red-300 font-semibold transition cursor-pointer">
                  REVOKE
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </Card>
    </motion.div>
  );
};

export default SessionInfoCard;
