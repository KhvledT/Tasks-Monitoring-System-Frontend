import React from "react";
import type { ChecklistTask } from "../types/checklist.types";
import { TaskStatusBadge } from "./TaskStatusBadge";
import { motion } from "framer-motion";

interface TaskCardProps {
  task: ChecklistTask;
  onAction: (task: ChecklistTask, action: "complete" | "postpone") => void;
  onEditTask?: (task: ChecklistTask) => void;
  onDeleteTask?: (task: ChecklistTask) => void;
  isArchiveMode?: boolean;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onAction,
  onEditTask,
  onDeleteTask,
  isArchiveMode,
}) => {
  const statusStr = String(task.status).toLowerCase();
  const isPending =
    statusStr !== "completed" &&
    statusStr !== "postponed" &&
    statusStr !== "1" &&
    statusStr !== "2";

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      className={`border rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border-zinc-200 hover:border-zinc-300 transition duration-200 group shadow-sm`}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-1.5 flex-wrap">
          <h5 className="text-sm font-bold text-gray-900 tracking-tight leading-tight truncate">
            {task.title}
          </h5>
          <TaskStatusBadge status={task.status} />
        </div>
        <p className="text-xs text-zinc-500 leading-normal font-medium max-w-2xl">
          {task.description || "No description provided."}
        </p>

        {/* Notes/Measurements or postponed justification logs */}
        {task.notes && (
          <div className="text-[11px] text-zinc-500 bg-zinc-50 border-l-2 border-zinc-300 pl-2 mt-2 italic">
            Notes: {task.notes}
          </div>
        )}
        {task.measurement && (
          <div className="text-[11px] text-primary font-mono mt-1 font-semibold">
            Measurement: <span className="font-bold">{task.measurement}</span>
          </div>
        )}
        {task.postponedReason && (
          <div className="text-[11px] text-amber-700 bg-amber-50 border-l-2 border-amber-300 pl-2 mt-2 italic">
            Postponed reason: {task.postponedReason}
          </div>
        )}
      </div>

      {!isArchiveMode && (
        <div className="flex items-center gap-2 md:opacity-0 group-hover:opacity-100 focus-within:opacity-100 group-focus-within:opacity-100 transition-all duration-200 shrink-0">
          {onEditTask && (
            <button
              onClick={() => onEditTask(task)}
              type="button"
              className="p-1.5 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 text-zinc-600 hover:text-blue-600 rounded-lg transition active:scale-95 focus:outline-none cursor-pointer"
              title="Edit Task Definition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-3.5 h-3.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                />
              </svg>
            </button>
          )}

          {onDeleteTask && (
            <button
              onClick={() => onDeleteTask(task)}
              type="button"
              className="p-1.5 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 rounded-lg transition active:scale-95 focus:outline-none cursor-pointer"
              title="Delete Task"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-3.5 h-3.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                />
              </svg>
            </button>
          )}

          {isPending ? (
            <>
              <button
                onClick={() => onAction(task, "complete")}
                type="button"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-250 text-emerald-700 text-xs font-bold rounded-lg transition active:scale-[0.97] focus:outline-none cursor-pointer"
                title="Complete Task"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2.5}
                  stroke="currentColor"
                  className="w-3.5 h-3.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m4.5 12.75 6 6 9-13.5"
                  />
                </svg>
                Complete
              </button>
              <button
                onClick={() => onAction(task, "postpone")}
                type="button"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-250 text-amber-700 text-xs font-bold rounded-lg transition active:scale-[0.97] focus:outline-none cursor-pointer"
                title="Postpone Task"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2.5}
                  stroke="currentColor"
                  className="w-3.5 h-3.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
                Postpone
              </button>
            </>
          ) : (
            /* Re-open / reset actions to allow editing states */
            <button
              onClick={() => onAction(task, "complete")}
              type="button"
              className="flex items-center gap-1 px-2.5 py-1.5 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 text-zinc-650 hover:text-gray-900 text-xs font-bold rounded-lg transition active:scale-[0.97] focus:outline-none cursor-pointer"
              title="Edit Logs"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-3.5 h-3.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                />
              </svg>
              Edit Logs
            </button>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default TaskCard;
