import React, { useState } from "react";
import { Card } from "@heroui/react";
import { motion } from "framer-motion";

export const SettingsCard: React.FC = () => {
  const [criticalAlerts, setCriticalAlerts] = useState(() => {
    return localStorage.getItem("settings_critical_alerts") !== "false";
  });
  const [logbookUpdates, setLogbookUpdates] = useState(() => {
    return localStorage.getItem("settings_logbook_updates") !== "false";
  });

  const toggleCriticalAlerts = () => {
    setCriticalAlerts((prev) => {
      const next = !prev;
      localStorage.setItem("settings_critical_alerts", String(next));
      return next;
    });
  };

  const toggleLogbookUpdates = () => {
    setLogbookUpdates((prev) => {
      const next = !prev;
      localStorage.setItem("settings_logbook_updates", String(next));
      return next;
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <Card className="border border-zinc-200 bg-white p-6 rounded-2xl shadow-sm h-full">
        <div className="mb-5">
          <h3 className="text-sm font-bold text-gray-900 tracking-tight mb-1">
            Application Settings
          </h3>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between py-3 border-b border-zinc-100">
            <div>
              <span className="text-xs font-bold text-gray-800">
                Critical Operational Alerts
              </span>
              <p className="text-[10px] text-zinc-500 mt-0.5">
                Receive notifications for urgent system alerts
              </p>
            </div>
            <button
              type="button"
              onClick={toggleCriticalAlerts}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 cursor-pointer ${
                criticalAlerts ? "bg-primary" : "bg-zinc-200"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ease-in-out ${
                  criticalAlerts ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between py-3">
            <div>
              <span className="text-xs font-bold text-gray-800">
                Logbook Updates
              </span>
              <p className="text-[10px] text-zinc-500 mt-0.5">
                Get notified when new log entries are recorded
              </p>
            </div>
            <button
              type="button"
              onClick={toggleLogbookUpdates}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 cursor-pointer ${
                logbookUpdates ? "bg-primary" : "bg-zinc-200"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ease-in-out ${
                  logbookUpdates ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default SettingsCard;
