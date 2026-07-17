import React from 'react';
import type { ChecklistTask } from '../types/checklist.types';
import { TaskStatusBadge } from './TaskStatusBadge';
import { motion } from 'framer-motion';

interface TaskCardProps {
  task: ChecklistTask;
  onAction: (task: ChecklistTask, action: 'complete' | 'postpone') => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onAction }) => {
  const statusStr = String(task.status).toLowerCase();
  const isPending = statusStr !== 'completed' && statusStr !== 'postponed' && statusStr !== '1' && statusStr !== '2';

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      className={`border rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-zinc-950/40 hover:border-zinc-800 transition duration-200 group border-zinc-900/60`}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-1.5 flex-wrap">
          <h5 className="text-sm font-bold text-zinc-200 tracking-tight leading-tight truncate">
            {task.title}
          </h5>
          <TaskStatusBadge status={task.status} />
        </div>
        <p className="text-xs text-zinc-400 leading-normal font-medium max-w-2xl">
          {task.description || 'No description provided.'}
        </p>

        {/* Notes/Measurements or postponed justification logs */}
        {task.notes && (
          <div className="text-[11px] text-zinc-450 bg-zinc-900/10 border-l-2 border-zinc-800 pl-2 mt-2 italic">
            Notes: {task.notes}
          </div>
        )}
        {task.measurement && (
          <div className="text-[11px] text-sky-400/90 font-mono mt-1">
            Measurement: <span className="font-bold">{task.measurement}</span>
          </div>
        )}
        {task.postponedReason && (
          <div className="text-[11px] text-amber-500/80 bg-zinc-900/10 border-l-2 border-amber-900/30 pl-2 mt-2 italic">
            Postponed reason: {task.postponedReason}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200 shrink-0">
        {isPending ? (
          <>
            <button
              onClick={() => onAction(task, 'complete')}
              type="button"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-950/40 hover:bg-emerald-900/30 border border-emerald-900/50 text-emerald-400 text-xs font-semibold rounded-lg transition active:scale-[0.97]"
              title="Complete Task"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
              Complete
            </button>
            <button
              onClick={() => onAction(task, 'postpone')}
              type="button"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-950/40 hover:bg-amber-900/30 border border-amber-900/50 text-amber-400 text-xs font-semibold rounded-lg transition active:scale-[0.97]"
              title="Postpone Task"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              Postpone
            </button>
          </>
        ) : (
          /* Re-open / reset actions to allow editing states */
          <button
            onClick={() => onAction(task, 'complete')}
            type="button"
            className="flex items-center gap-1 px-2.5 py-1.5 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-400 text-xs font-medium rounded-lg transition active:scale-[0.97]"
            title="Edit Logs"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
            </svg>
            Edit Logs
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default TaskCard;
