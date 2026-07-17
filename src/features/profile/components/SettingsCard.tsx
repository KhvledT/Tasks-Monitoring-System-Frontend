import React from 'react';
import { Card } from '@heroui/react';
import { motion } from 'framer-motion';
import type { UserSetting } from '../types/profile.types';

interface SettingsCardProps {
  settings: UserSetting[];
  isEmpty: boolean;
  emptyMessage: string;
}

export const SettingsCard: React.FC<SettingsCardProps> = ({
  settings,
  isEmpty,
  emptyMessage,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <Card className="border border-zinc-900 bg-zinc-950/40 p-6 rounded-2xl backdrop-blur-md h-full">
        <h3 className="text-sm font-bold text-zinc-200 tracking-tight mb-1">Preferences</h3>
        <p className="text-xs text-zinc-500 mb-5 leading-relaxed">
          User settings exposed by the backend for your account.
        </p>

        {isEmpty ? (
          <div className="flex flex-col items-center justify-center text-center gap-3 py-6 min-h-[120px]">
            <div className="w-10 h-10 rounded-full bg-zinc-900/60 border border-zinc-800 flex items-center justify-center text-zinc-500">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.345 1.422l-1.027.827c-.292.235-.458.605-.42.99a8.04 8.04 0 0 1 0 .426c-.038.385.128.755.42.99l1.027.827c.447.36.547.997.345 1.422l-1.296 2.247a1.125 1.125 0 0 1-1.37.49l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.5 6.5 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.5 6.5 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .345-1.422l1.027-.827c.292-.235.458-.605.42-.99a8.3 8.3 0 0 1 0-.426c.038-.385-.128-.755-.42-.99l-1.027-.828a1.125 1.125 0 0 1-.345-1.421l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              </svg>
            </div>
            <p className="text-xs text-zinc-450 leading-relaxed max-w-sm">{emptyMessage}</p>
          </div>
        ) : (
          <ul className="flex flex-col gap-2" role="list">
            {settings.map((setting) => (
              <li
                key={setting.key}
                className="flex items-center justify-between gap-3 border border-zinc-900 rounded-xl px-3 py-2.5 bg-zinc-900/30"
              >
                <span className="text-xs font-semibold text-zinc-300">{setting.label}</span>
                <span className="text-xs text-zinc-400">{setting.value}</span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </motion.div>
  );
};

export default SettingsCard;
