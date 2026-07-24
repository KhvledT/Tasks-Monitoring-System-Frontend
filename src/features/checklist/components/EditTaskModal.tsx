import React, { useState, useEffect } from "react";
import { CHECKLIST_KEYS } from "../../../constants/query-keys/checklist";
import type { ChecklistTask } from "../types/checklist.types";
import { checklistApi } from "../api/checklist.api";
import { useActiveVessel } from "../../../shared/hooks/useActiveVessel";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

interface EditTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: ChecklistTask | null;
}

export const EditTaskModal: React.FC<EditTaskModalProps> = ({
  isOpen,
  onClose,
  task,
}) => {
  const { activeVesselId } = useActiveVessel();
  const queryClient = useQueryClient();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title || "");
      setDescription(task.description || "");
    }
  }, [task]);

  if (!isOpen || !task) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Task title is required");
      return;
    }
    if (!activeVesselId) {
      toast.error("No active vessel selected");
      return;
    }

    const taskId = task.taskDefinitionId || task.id;

    setIsSubmitting(true);
    try {
      await checklistApi.updateCustomTask(activeVesselId, taskId, {
        title: title.trim(),
        description: description.trim(),
      });
      toast.success("Task updated successfully!");
      await queryClient.invalidateQueries({ queryKey: CHECKLIST_KEYS.all() });
      await queryClient.refetchQueries({ queryKey: CHECKLIST_KEYS.all() });
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update task");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white border border-zinc-200 rounded-3xl p-6 max-w-lg w-full shadow-2xl flex flex-col gap-5">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center text-sm font-extrabold">
              ✏️
            </span>
            <div>
              <h3 className="text-base font-extrabold text-gray-900 tracking-tight">
                Update Vessel Task
              </h3>
              <p className="text-xs text-zinc-500 font-medium">
                Modify task title and operational description.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-700 transition cursor-pointer p-1"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Task Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Inspect Auxiliary Generator Fuel Pressure"
              className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-gray-900 font-medium focus:bg-white focus:border-[#0055d4] focus:outline-none transition shadow-2xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Description / Instructions (Optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Detail specific check steps, operating ranges, or safety directives..."
              className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-gray-900 font-medium focus:bg-white focus:border-[#0055d4] focus:outline-none transition shadow-2xs"
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold text-xs rounded-xl transition border border-zinc-300 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2.5 bg-[#0055d4] hover:bg-[#003fa3] disabled:opacity-50 text-white font-extrabold text-xs rounded-xl transition shadow-xs cursor-pointer"
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTaskModal;
