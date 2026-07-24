import React, { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { checklistApi } from "../api/checklist.api";
import { CHECKLIST_KEYS } from "../../../constants/query-keys/checklist";
import { toast } from "react-hot-toast";

interface VesselTaskItem {
  id?: string;
  taskDefinitionId?: string;
  categoryId?: string;
  title: string;
  description: string;
  taskGroup: "Daily" | "Weekly" | "Monthly" | "SigningOn";
  frequency?: string;
  severity?: string;
  unit?: string;
}

interface VesselTaskEditorModalProps {
  vesselId: string;
  vesselName?: string;
  isOpen: boolean;
  onClose: () => void;
}

export const VesselTaskEditorModal: React.FC<VesselTaskEditorModalProps> = ({
  vesselId,
  vesselName,
  isOpen,
  onClose,
}) => {
  const queryClient = useQueryClient();
  const [tasksList, setTasksList] = useState<VesselTaskItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Active Task Form state for adding/editing inline
  const [activeTaskSection, setActiveTaskSection] = useState<string | null>(null);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  // Inline Form Fields
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");

  // Fetch vessel tasks
  const { data: rawTasksData, isLoading } = useQuery({
    queryKey: ["vessel-tasks-editor", vesselId],
    queryFn: async () => {
      const dailyRes = await checklistApi.getTasks(vesselId, "Daily").catch(() => null);
      const weeklyRes = await checklistApi.getTasks(vesselId, "Weekly").catch(() => null);
      const monthlyRes = await checklistApi.getTasks(vesselId, "Monthly").catch(() => null);
      const signRes = await checklistApi.getTasks(vesselId, "SigningOn").catch(() => null);
      return { dailyRes, weeklyRes, monthlyRes, signRes };
    },
    enabled: isOpen && !!vesselId,
  });

  useEffect(() => {
    if (rawTasksData) {
      const items: VesselTaskItem[] = [];

      const processSection = (res: any, defaultGroup: "Daily" | "Weekly" | "Monthly" | "SigningOn") => {
        if (!res) return;
        const tasks = res.tasks || [];
        const cats = res.categories || [];
        const catMap = new Map<string, string>();
        cats.forEach((c: any) => catMap.set(String(c._id || c.id), c.name));

        tasks.forEach((t: any) => {
          items.push({
            id: t._id || t.id,
            taskDefinitionId: t._id || t.id,
            categoryId: t.categoryId,
            title: t.title,
            description: t.description || "",
            taskGroup: defaultGroup,
          });
        });
      };

      processSection(rawTasksData.dailyRes, "Daily");
      processSection(rawTasksData.weeklyRes, "Weekly");
      processSection(rawTasksData.monthlyRes, "Monthly");
      processSection(rawTasksData.signRes, "SigningOn");

      setTasksList(items);
    }
  }, [rawTasksData]);

  if (!isOpen) return null;

  const mapGroupToEnum = (group: string): "daily" | "weekly" | "monthly" | "signing-on" => {
    const g = (group || "").toLowerCase().replace(/[^a-z]/g, "");
    if (g.includes("sign")) return "signing-on";
    if (g.includes("week")) return "weekly";
    if (g.includes("month")) return "monthly";
    return "daily";
  };

  const handleSaveInlineTask = async (sectionKey: "Daily" | "Weekly" | "Monthly" | "SigningOn") => {
    if (!taskTitle.trim()) {
      toast.error("Task title is required");
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingTaskId) {
        // Update existing task
        await checklistApi.updateCustomTask(vesselId, editingTaskId, {
          title: taskTitle.trim(),
          description: taskDescription.trim(),
        });
        toast.success("Task updated successfully!");
        setTasksList((prev) =>
          prev.map((t) =>
            (t.id || t.taskDefinitionId) === editingTaskId
              ? { ...t, title: taskTitle.trim(), description: taskDescription.trim() }
              : t
          )
        );
      } else {
        // Create new task
        const enumGroup = mapGroupToEnum(sectionKey);
        const created = await checklistApi.createCustomTask(vesselId, {
          title: taskTitle.trim(),
          description: taskDescription.trim(),
          taskGroup: enumGroup,
        });
        toast.success("New task created!");
        setTasksList((prev) => [
          ...prev,
          {
            id: created?._id || created?.id || `new-${Date.now()}`,
            taskDefinitionId: created?._id || created?.id,
            title: taskTitle.trim(),
            description: taskDescription.trim(),
            taskGroup: sectionKey,
          },
        ]);
      }

      await queryClient.invalidateQueries({ queryKey: CHECKLIST_KEYS.all() });
      resetInlineTaskForm();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to save task");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTask = async (task: VesselTaskItem) => {
    const idToDelete = task.taskDefinitionId || task.id;
    if (!idToDelete) return;

    if (!confirm(`Are you sure you want to delete "${task.title}"?`)) return;

    try {
      await checklistApi.deleteCustomTask(vesselId, idToDelete);
      toast.success("Task deleted successfully!");
      setTasksList((prev) => prev.filter((t) => (t.taskDefinitionId || t.id) !== idToDelete));
      await queryClient.invalidateQueries({ queryKey: CHECKLIST_KEYS.all() });
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete task");
    }
  };

  const resetInlineTaskForm = () => {
    setActiveTaskSection(null);
    setEditingTaskId(null);
    setTaskTitle("");
    setTaskDescription("");
  };

  const handleEditInlineTask = (task: VesselTaskItem) => {
    setActiveTaskSection(task.taskGroup);
    setEditingTaskId(task.taskDefinitionId || task.id || null);
    setTaskTitle(task.title);
    setTaskDescription(task.description);
  };

  const sectionConfigs = [
    { title: "Daily", key: "Daily" as const, icon: "☀️", color: "border-[#0055d4]/20 bg-blue-50/30", btnColor: "bg-[#0055d4] hover:bg-[#003fa3]" },
    { title: "Weekly", key: "Weekly" as const, icon: "📅", color: "border-blue-200 bg-blue-50/30", btnColor: "bg-[#0055d4] hover:bg-[#003fa3]" },
    { title: "Monthly", key: "Monthly" as const, icon: "🗓️", color: "border-purple-200 bg-purple-50/30", btnColor: "bg-[#0055d4] hover:bg-[#003fa3]" },
    { title: "On Sign", key: "SigningOn" as const, icon: "⚓", color: "border-emerald-200 bg-emerald-50/30", btnColor: "bg-[#0055d4] hover:bg-[#003fa3]" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl border border-zinc-200 overflow-hidden my-6 animate-in fade-in zoom-in duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-zinc-150 bg-zinc-50/80">
          <div>
            <span className="text-[10px] font-extrabold uppercase text-[#0055d4] bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
              Personal Vessel Management
            </span>
            <h2 className="text-xl font-extrabold text-black tracking-tight mt-1">
              Update Vessel Inspection Tasks {vesselName ? `— ${vesselName}` : ""}
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Add, update, or remove inspection tasks directly across all frequency sections.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-zinc-200 hover:bg-zinc-300 text-zinc-700 text-sm font-bold transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-8 flex flex-col gap-8 max-h-[75vh] overflow-y-auto">
          {isLoading ? (
            <div className="p-12 text-center text-xs text-zinc-400 italic">
              Loading vessel tasks library...
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
                <div>
                  <h3 className="text-sm font-extrabold text-black">
                    Step 2: Add Tasks across Frequency Sections
                  </h3>
                  <p className="text-[11px] text-zinc-400">
                    Empty sections are allowed. Every task includes its full definition.
                  </p>
                </div>
                <span className="text-xs font-bold text-zinc-500 font-mono">
                  Total Active Tasks: {tasksList.length}
                </span>
              </div>

              {/* 4 Frequency Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {sectionConfigs.map((sec) => {
                  const secTasks = tasksList.filter((t) => t.taskGroup === sec.key);
                  const isBuilding = activeTaskSection === sec.key;

                  return (
                    <div
                      key={sec.key}
                      className={`border p-5 rounded-2xl flex flex-col gap-4 transition ${sec.color}`}
                    >
                      {/* Section Header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-base">{sec.icon}</span>
                          <h4 className="text-xs font-extrabold text-black uppercase tracking-wider">
                            {sec.title} TASKS ({secTasks.length})
                          </h4>
                        </div>
                        <button
                          onClick={() => {
                            if (isBuilding && !editingTaskId) {
                              resetInlineTaskForm();
                            } else {
                              resetInlineTaskForm();
                              setActiveTaskSection(sec.key);
                            }
                          }}
                          className={`px-3 py-1.5 text-xs font-bold text-white rounded-xl shadow-2xs transition cursor-pointer ${sec.btnColor}`}
                        >
                          + Add Task to {sec.title}
                        </button>
                      </div>

                      {/* Inline Task Form Builder */}
                      {isBuilding && (
                        <div className="bg-white border border-zinc-300 p-4 rounded-xl shadow-sm flex flex-col gap-3 animate-in fade-in duration-100">
                          <h5 className="text-xs font-extrabold text-black">
                            {editingTaskId ? "✏️ Edit Task" : `+ Add Task to ${sec.title}`}
                          </h5>

                          <div>
                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">
                              Task Title
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. Inspect Emergency Pump Hydraulic Pressure"
                              value={taskTitle}
                              onChange={(e) => setTaskTitle(e.target.value)}
                              className="w-full bg-zinc-50 border border-zinc-200 p-2.5 text-xs font-semibold rounded-lg text-black focus:border-[#0055d4]"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">
                              Description / Instructions (Optional)
                            </label>
                            <textarea
                              placeholder="e.g. Verify pressure reading is above 120 bar."
                              value={taskDescription}
                              onChange={(e) => setTaskDescription(e.target.value)}
                              rows={2}
                              className="w-full bg-zinc-50 border border-zinc-200 p-2.5 text-xs font-semibold rounded-lg text-black resize-none"
                            />
                          </div>

                          <div className="flex items-center justify-end gap-2 pt-1">
                            <button
                              type="button"
                              onClick={resetInlineTaskForm}
                              className="px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-bold rounded-lg transition cursor-pointer"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              disabled={isSubmitting}
                              onClick={() => handleSaveInlineTask(sec.key)}
                              className="px-4 py-1.5 bg-[#0055d4] hover:bg-[#003fa3] text-white text-xs font-extrabold rounded-lg transition cursor-pointer shadow-xs"
                            >
                              {isSubmitting ? "Saving..." : editingTaskId ? "Update Task" : "Save Task"}
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Tasks List */}
                      {secTasks.length === 0 ? (
                        <div className="bg-white/70 border border-dashed border-zinc-300 rounded-xl p-4 text-center text-xs text-zinc-400 font-mono italic">
                          (Section is empty)
                        </div>
                      ) : (
                        <div className="flex flex-col gap-2.5">
                          {secTasks.map((t) => (
                            <div
                              key={t.id || t.taskDefinitionId || t.title}
                              className="bg-white border border-zinc-200 rounded-xl p-3.5 flex items-start justify-between gap-3 shadow-2xs hover:border-zinc-400 transition"
                            >
                              <div className="flex flex-col gap-1 flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-extrabold text-black">
                                    {t.title}
                                  </span>
                                </div>
                                {t.description && (
                                  <p className="text-[11px] text-zinc-500">
                                    {t.description}
                                  </p>
                                )}
                              </div>

                              <div className="flex items-center gap-1.5 shrink-0">
                                <button
                                  onClick={() => handleEditInlineTask(t)}
                                  title="Edit Task"
                                  className="w-7 h-7 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs flex items-center justify-center transition cursor-pointer"
                                >
                                  ✏️
                                </button>
                                <button
                                  onClick={() => handleDeleteTask(t)}
                                  title="Delete Task"
                                  className="w-7 h-7 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 text-xs flex items-center justify-center transition cursor-pointer"
                                >
                                  🗑️
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-8 py-4 border-t border-zinc-150 bg-zinc-50 text-xs font-semibold text-zinc-500">
          <span className="font-mono text-[11px]">
            Vessel Isolation Active • {tasksList.length} Tasks Defined Total
          </span>
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-[#0055d4] hover:bg-[#003fa3] text-white text-xs font-extrabold rounded-xl transition cursor-pointer shadow-sm"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default VesselTaskEditorModal;
