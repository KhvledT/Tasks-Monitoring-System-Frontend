import React from 'react';
import { Card } from '@heroui/react';
import { motion } from 'framer-motion';

export const SettingsCard: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <Card className="border border-zinc-900 bg-zinc-950/40 p-6 rounded-2xl backdrop-blur-md h-full">
        <div className="mb-5">
          <h3 className="text-sm font-bold text-zinc-200 tracking-tight mb-1">Application Settings</h3>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between py-3 border-b border-zinc-900/50">
            <div>
              <span className="text-xs font-bold text-zinc-200">Critical Operational Alerts</span>
              <p className="text-[10px] text-zinc-500 mt-0.5">Receive notifications for urgent system alerts</p>
            </div>
            <button
              type="button"
              className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors bg-primary"
            >
              <span className="inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform translate-x-6" />
            </button>
          </div>

          <div className="flex items-center justify-between py-3 border-b border-zinc-900/50">
            <div>
              <span className="text-xs font-bold text-zinc-200">Logbook Updates</span>
              <p className="text-[10px] text-zinc-500 mt-0.5">Get notified when new log entries are recorded</p>
            </div>
            <button
              type="button"
              className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors bg-primary"
            >
              <span className="inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform translate-x-6" />
            </button>
          </div>

          <div className="flex items-center justify-between py-3">
            <div>
              <span className="text-xs font-bold text-zinc-200">Appearance Mode</span>
              <p className="text-[10px] text-zinc-500 mt-0.5">Current: Light Mode (Day Monitoring)</p>
            </div>
            <button
              type="button"
              className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-400 text-xs font-semibold rounded-lg transition cursor-pointer"
            >
              Switch Theme
            </button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default SettingsCard;
