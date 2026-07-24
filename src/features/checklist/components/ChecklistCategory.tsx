import React, { useState } from "react";
import type {
  ChecklistCategoryGroup,
  ChecklistTask,
} from "../types/checklist.types";
import { TaskCard } from "./TaskCard";
import { checklistMetricsService } from "../services/checklist-metrics.service";
import { motion, AnimatePresence } from "framer-motion";

interface ChecklistCategoryProps {
  group: ChecklistCategoryGroup;
  onTaskAction: (task: ChecklistTask, action: "complete" | "postpone") => void;
  onEditTask?: (task: ChecklistTask) => void;
  onDeleteTask?: (task: ChecklistTask) => void;
  isArchiveMode?: boolean;
}

export const ChecklistCategory: React.FC<ChecklistCategoryProps> = ({
  group,
  onTaskAction,
  onEditTask,
  onDeleteTask,
  isArchiveMode,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const { category, tasks } = group;

  // Calculate metrics using the pure service
  const { completedCount, totalCount, isCompleted } =
    checklistMetricsService.calculateCategoryProgress(tasks);

  return (
    <div className="border border-zinc-200 bg-white rounded-2xl overflow-hidden mb-4 shadow-sm hover:border-zinc-300 transition duration-150">
      {/* Accordion Header */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-6 py-4 bg-zinc-50 border-b border-zinc-200 text-left cursor-pointer focus:outline-none"
      >
        <div className="flex items-center gap-3">
          <h4 className="text-sm font-bold text-gray-900 tracking-tight">
            {category.name}
          </h4>
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-md border tracking-wide uppercase ${
              isCompleted
                ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                : " text-zinc-650 border-zinc-200"
            }`}
          >
            {completedCount} / {totalCount} Completed
          </span>
        </div>

        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className={`w-4 h-4 text-zinc-400 transition-transform duration-250 ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m19.5 8.25-7.5 7.5-7.5-7.5"
          />
        </svg>
      </button>

      {/* Accordion Content wrapper */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden bg-white"
          >
            <div className="p-6 flex flex-col gap-4">
              {tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onAction={onTaskAction}
                  onEditTask={onEditTask}
                  onDeleteTask={onDeleteTask}
                  isArchiveMode={isArchiveMode}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChecklistCategory;
