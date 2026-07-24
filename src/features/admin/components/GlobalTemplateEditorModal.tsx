import React, { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { templatesApi, type Template } from "../../templates/api/templates.api";
import { toast } from "react-hot-toast";

interface TaskDraftItem {
  id?: string;
  categoryId?: string;
  title: string;
  description: string;
  taskGroup: "Daily" | "Weekly" | "Monthly" | "SigningOn";
  frequency: string;
  severity: string;
  unit: string;
  requirePhoto: boolean;
  requireNotes: boolean;
}

interface GlobalTemplateEditorModalProps {
  templateToEdit?: Template | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const GlobalTemplateEditorModal: React.FC<GlobalTemplateEditorModalProps> = ({
  templateToEdit,
  onClose,
  onSuccess,
}) => {
  const queryClient = useQueryClient();
  const isUpdateMode = !!templateToEdit;

  // Step 1 States
  const [selectedRank, setSelectedRank] = useState("Second Officer");
  const [selectedVesselType, setSelectedVesselType] = useState("Container");
  const [templateName, setTemplateName] = useState("");
  const [templateDesc, setTemplateDesc] = useState("");

  // Step 2 Tasks State (Tasks across all 4 sections)
  const [tasksList, setTasksList] = useState<TaskDraftItem[]>([]);

  // Active Task Form state for adding/editing inline
  const [activeTaskSection, setActiveTaskSection] = useState<string | null>(null);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  // Form Fields for active inline task builder
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskFrequency, setTaskFrequency] = useState("Daily");
  const [taskSeverity, setTaskSeverity] = useState("Medium");
  const [taskUnit, setTaskUnit] = useState("bar");
  const [taskRequirePhoto, setTaskRequirePhoto] = useState(false);
  const [taskRequireNotes, setTaskRequireNotes] = useState(false);

  // Meta Options Query (Dynamic Ranks, Vessel Types, Frequencies, Severities, Units)
  const { data: metaOptions } = useQuery({
    queryKey: ["meta-options"],
    queryFn: () => templatesApi.getMetaOptions(),
  });

  const ranks = metaOptions?.ranks || ["Captain", "Chief Officer", "Second Officer", "Third Officer", "Bosun", "Able Seaman", "Chief Engineer"];
  const vesselTypes = metaOptions?.vesselTypes || ["Container", "Tanker", "Bulk Carrier", "Passenger", "General Cargo"];
  const frequencies = metaOptions?.frequencies || ["Daily", "Weekly", "Monthly", "On Demand", "Signing On"];
  const severities = metaOptions?.severities || ["Critical", "High", "Medium", "Low"];
  const units = metaOptions?.measurementUnits || ["bar", "°C", "RPM", "Volts", "Hours", "Litres", "Percentage", "None"];

  // Fetch Existing Template Details if Update Mode
  const { data: existingDetails, isLoading: isDetailsLoading } = useQuery({
    queryKey: ["template-details", templateToEdit?._id || templateToEdit?.id],
    queryFn: () => templatesApi.getTemplateDetails((templateToEdit?._id || templateToEdit?.id)!),
    enabled: isUpdateMode && !!(templateToEdit?._id || templateToEdit?.id),
  });

  // Populate data in Update Mode
  useEffect(() => {
    if (isUpdateMode && templateToEdit) {
      setSelectedRank(templateToEdit.rank || "Second Officer");
      setSelectedVesselType(templateToEdit.vesselType || "Container");
      setTemplateName(templateToEdit.name || "");
      setTemplateDesc(templateToEdit.description || "");
    } else {
      setTemplateName(`${selectedRank} — ${selectedVesselType} Master Template`);
    }
  }, [isUpdateMode, templateToEdit, selectedRank, selectedVesselType]);

  // Load existing categories and tasks in Update Mode
  useEffect(() => {
    if (existingDetails) {
      const cats = existingDetails.categories || [];
      const defs = existingDetails.definitions || existingDetails.tasks || [];

      const loadedTasks: TaskDraftItem[] = [];
      cats.forEach((cat) => {
        const rawGroup = (cat.taskGroup || "").toLowerCase();
        let catGroup: "Daily" | "Weekly" | "Monthly" | "SigningOn" = "Daily";
        if (rawGroup.includes("sign")) catGroup = "SigningOn";
        else if (rawGroup === "weekly") catGroup = "Weekly";
        else if (rawGroup === "monthly") catGroup = "Monthly";
        else if (rawGroup === "daily") catGroup = "Daily";

        const catDefs = defs.filter((d: any) => String(d.categoryId) === String(cat._id || cat.id));
        catDefs.forEach((d: any) => {
          loadedTasks.push({
            id: d._id || d.id,
            categoryId: cat._id || cat.id,
            title: d.title,
            description: d.description || "",
            taskGroup: catGroup,
            frequency: d.frequency || catGroup,
            severity: d.severity || "Medium",
            unit: d.unit || "bar",
            requirePhoto: !!d.requirePhoto,
            requireNotes: !!d.requireNotes,
          });
        });
      });

      const seenKeys = new Set<string>();
      const uniqueLoadedTasks: TaskDraftItem[] = [];
      loadedTasks.forEach((item) => {
        const key = `${item.taskGroup}::${item.title.trim().toLowerCase()}`;
        if (!seenKeys.has(key)) {
          seenKeys.add(key);
          uniqueLoadedTasks.push(item);
        }
      });

      setTasksList(uniqueLoadedTasks);
    }
  }, [existingDetails]);

  // Handle Add/Save Inline Task
  const handleSaveInlineTask = (sectionKey: "Daily" | "Weekly" | "Monthly" | "SigningOn") => {
    if (!taskTitle.trim()) {
      toast.error("Task title is required");
      return;
    }

    if (editingTaskId) {
      // Update existing task draft
      setTasksList((prev) =>
        prev.map((t) =>
          (t.id || t.title) === editingTaskId
            ? {
                ...t,
                title: taskTitle,
                description: taskDescription,
                frequency: taskFrequency,
                severity: taskSeverity,
                unit: taskUnit,
                requirePhoto: taskRequirePhoto,
                requireNotes: taskRequireNotes,
              }
            : t
        )
      );
    } else {
      // Add new task draft
      setTasksList((prev) => [
        ...prev,
        {
          id: `draft-${Date.now()}-${Math.random()}`,
          title: taskTitle,
          description: taskDescription,
          taskGroup: sectionKey,
          frequency: taskFrequency || sectionKey,
          severity: taskSeverity,
          unit: taskUnit,
          requirePhoto: taskRequirePhoto,
          requireNotes: taskRequireNotes,
        },
      ]);
    }

    // Reset task form
    resetInlineTaskForm();
  };

  const resetInlineTaskForm = () => {
    setActiveTaskSection(null);
    setEditingTaskId(null);
    setTaskTitle("");
    setTaskDescription("");
    setTaskFrequency("Daily");
    setTaskSeverity("Medium");
    setTaskUnit("bar");
    setTaskRequirePhoto(false);
    setTaskRequireNotes(false);
  };

  const handleEditInlineTask = (task: TaskDraftItem) => {
    setActiveTaskSection(task.taskGroup);
    setEditingTaskId(task.id || task.title);
    setTaskTitle(task.title);
    setTaskDescription(task.description);
    setTaskFrequency(task.frequency);
    setTaskSeverity(task.severity);
    setTaskUnit(task.unit);
    setTaskRequirePhoto(task.requirePhoto);
    setTaskRequireNotes(task.requireNotes);
  };

  const handleRemoveTask = (taskId: string) => {
    setTasksList((prev) => prev.filter((t) => (t.id || t.title) !== taskId));
  };

  // Submit Mutation
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSaveFullTemplate = async () => {
    if (!templateName.trim()) {
      toast.error("Template name is required");
      return;
    }

    setIsSubmitting(true);
    try {
      let tplId = templateToEdit?._id || templateToEdit?.id;
      let existingCats = existingDetails?.categories || [];
      let existingDefs = existingDetails?.definitions || existingDetails?.tasks || [];

      if (isUpdateMode && tplId) {
        // 1. Update Template Metadata
        await templatesApi.updateTemplate(tplId, {
          name: templateName,
          rank: selectedRank,
          vesselType: selectedVesselType,
          description: templateDesc,
        } as any);

        // Fetch fresh details if available to ensure we have category IDs
        try {
          const freshDetails = await templatesApi.getTemplateDetails(tplId);
          if (freshDetails?.categories) existingCats = freshDetails.categories;
          if (freshDetails?.definitions || freshDetails?.tasks) {
            existingDefs = freshDetails.definitions || freshDetails.tasks || [];
          }
        } catch (e) {
          console.warn("Could not refetch details during template update", e);
        }
      } else {
        // 1. Create New Global Master Template
        const created = await templatesApi.createTemplate({
          name: templateName,
          rank: selectedRank,
          vesselType: selectedVesselType,
          description: templateDesc,
          scope: "GLOBAL",
        } as any);
        tplId = created._id || created.id;
      }

      // 2. Process Categories and Tasks for each of the 4 task groups
      const sections: ("Daily" | "Weekly" | "Monthly" | "SigningOn")[] = [
        "Daily",
        "Weekly",
        "Monthly",
        "SigningOn",
      ];

      for (const section of sections) {
        const sectionTasks = tasksList.filter((t) => t.taskGroup === section);
        if (sectionTasks.length > 0) {
          const backendTaskGroup =
            section === "SigningOn" ? "signing-on" : section.toLowerCase();

          // Reuse existing category if present for this group
          let cat = existingCats.find(
            (c: any) =>
              (c.taskGroup || "").toLowerCase() === backendTaskGroup.toLowerCase() ||
              (c.name || "").toLowerCase().includes(section.toLowerCase())
          );

          if (!cat) {
            const catName = `${section} Operational Checks`;
            cat = await templatesApi.createCategory({
              templateId: tplId!,
              name: catName,
              taskGroup: backendTaskGroup,
              displayOrder: 1,
            });
            existingCats.push(cat);
          }

          const categoryId = cat._id || cat.id;

          // Add or Update tasks in category
          let order = 1;
          for (const taskItem of sectionTasks) {
            const taskData = {
              categoryId,
              title: taskItem.title,
              description: taskItem.description,
              displayOrder: order++,
              frequency: taskItem.frequency,
              severity: taskItem.severity,
              unit: taskItem.unit,
            };

            const isExistingDef =
              taskItem.id &&
              !taskItem.id.startsWith("draft-") &&
              existingDefs.some(
                (d: any) => String(d._id || d.id) === String(taskItem.id)
              );

            if (isExistingDef && isUpdateMode) {
              await templatesApi.updateDefinition(
                tplId!,
                taskItem.id!,
                taskData as any
              );
            } else {
              await templatesApi.createDefinition(tplId!, taskData as any);
            }
          }
        }
      }

      // 3. Soft-delete definitions removed by user during editing
      if (isUpdateMode && existingDefs.length > 0) {
        const currentTaskIds = new Set(
          tasksList
            .map((t) => t.id)
            .filter((id): id is string => !!id && !id.startsWith("draft-"))
        );

        for (const oldDef of existingDefs) {
          const oldId = String((oldDef as any)._id || (oldDef as any).id);
          if (!currentTaskIds.has(oldId)) {
            try {
              await templatesApi.deleteDefinition(tplId!, oldId);
            } catch (err) {
              console.warn(
                "Failed to soft-delete removed task definition:",
                oldId,
                err
              );
            }
          }
        }
      }

      toast.success(
        isUpdateMode
          ? "Master Global Template updated successfully!"
          : "Master Global Template created successfully!"
      );

      queryClient.invalidateQueries({ queryKey: ["templates"] });
      queryClient.invalidateQueries({ queryKey: ["template-details", tplId] });
      onSuccess();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to save template");
    } finally {
      setIsSubmitting(false);
    }
  };

  const sectionConfigs = [
    { title: "Daily", key: "Daily" as const, icon: "☀️", color: "border-amber-200 bg-amber-50/50" },
    { title: "Weekly", key: "Weekly" as const, icon: "📅", color: "border-blue-200 bg-blue-50/50" },
    { title: "Monthly", key: "Monthly" as const, icon: "🗓️", color: "border-purple-200 bg-purple-50/50" },
    { title: "On Sign", key: "SigningOn" as const, icon: "⚓", color: "border-emerald-200 bg-emerald-50/50" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl border border-zinc-200 overflow-hidden my-6 animate-in fade-in zoom-in duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-zinc-150 bg-zinc-50/80">
          <div>
            <span className="text-[10px] font-extrabold uppercase text-[#0055d4] bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
              {isUpdateMode ? "Update Global Template" : "Add New Global Template"}
            </span>
            <h2 className="text-xl font-extrabold text-black tracking-tight mt-1">
              {isUpdateMode ? `Edit Template: ${templateName}` : "Create Master Global Template"}
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Select Rank + Vessel Type, then define operational tasks directly across frequency sections.
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
          {isUpdateMode && isDetailsLoading ? (
            <div className="p-12 text-center text-xs text-zinc-400 italic">
              Loading template data for editing...
            </div>
          ) : (
            <>
              {/* STEP 1: IDENTITY SELECTION (RANK + VESSEL TYPE) */}
              <div className="bg-zinc-50 border border-zinc-200 p-6 rounded-2xl flex flex-col gap-4">
                <div className="flex items-center gap-2 border-b border-zinc-200 pb-3">
                  <span className="w-6 h-6 rounded-full bg-[#0055d4] text-white text-xs font-black flex items-center justify-center">
                    1
                  </span>
                  <h3 className="text-sm font-extrabold text-black">
                    Step 1: Select Rank & Vessel Type Identity
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-extrabold text-zinc-500 uppercase tracking-wider block mb-1.5">
                      Select Rank
                    </label>
                    <select
                      value={selectedRank}
                      onChange={(e) => {
                        setSelectedRank(e.target.value);
                        if (!isUpdateMode) {
                          setTemplateName(`${e.target.value} — ${selectedVesselType} Master Template`);
                        }
                      }}
                      className="w-full bg-white border border-zinc-200 p-3 text-xs font-bold rounded-xl text-black shadow-2xs focus:border-[#0055d4]"
                    >
                      {ranks.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-extrabold text-zinc-500 uppercase tracking-wider block mb-1.5">
                      Select Vessel Type
                    </label>
                    <select
                      value={selectedVesselType}
                      onChange={(e) => {
                        setSelectedVesselType(e.target.value);
                        if (!isUpdateMode) {
                          setTemplateName(`${selectedRank} — ${e.target.value} Master Template`);
                        }
                      }}
                      className="w-full bg-white border border-zinc-200 p-3 text-xs font-bold rounded-xl text-black shadow-2xs focus:border-[#0055d4]"
                    >
                      {vesselTypes.map((vt) => (
                        <option key={vt} value={vt}>
                          {vt}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="text-[11px] font-extrabold text-zinc-500 uppercase tracking-wider block mb-1">
                      Template Title
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Second Officer — Oil Tanker Master Operations"
                      value={templateName}
                      onChange={(e) => setTemplateName(e.target.value)}
                      className="w-full bg-white border border-zinc-200 p-2.5 text-xs font-semibold rounded-xl text-black"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-extrabold text-zinc-500 uppercase tracking-wider block mb-1">
                      Description (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. SOLAS & ISM Operational Checklist Template"
                      value={templateDesc}
                      onChange={(e) => setTemplateDesc(e.target.value)}
                      className="w-full bg-white border border-zinc-200 p-2.5 text-xs font-semibold rounded-xl text-black"
                    />
                  </div>
                </div>
              </div>

              {/* STEP 2: TASK SECTIONS (DAILY, WEEKLY, MONTHLY, ON SIGN) */}
              <div className="flex flex-col gap-5">
                <div className="flex items-center gap-2 border-b border-zinc-200 pb-3">
                  <span className="w-6 h-6 rounded-full bg-[#0055d4] text-white text-xs font-black flex items-center justify-center">
                    2
                  </span>
                  <div>
                    <h3 className="text-sm font-extrabold text-black">
                      Step 2: Add Tasks across Frequency Sections
                    </h3>
                    <p className="text-[11px] text-zinc-400">
                      Empty sections are allowed. Every task includes its full definition.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {sectionConfigs.map((config) => {
                    const sectionTasks = tasksList.filter((t) => t.taskGroup === config.key);
                    const isFormOpen = activeTaskSection === config.key;

                    return (
                      <div
                        key={config.key}
                        className={`border rounded-3xl p-5 flex flex-col gap-4 bg-white ${config.color}`}
                      >
                        <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{config.icon}</span>
                            <h4 className="text-xs font-extrabold text-black uppercase tracking-wider">
                              {config.title} Tasks ({sectionTasks.length})
                            </h4>
                          </div>
                          <button
                            onClick={() => {
                              if (isFormOpen) {
                                resetInlineTaskForm();
                              } else {
                                resetInlineTaskForm();
                                setActiveTaskSection(config.key);
                                setTaskFrequency(config.title);
                              }
                            }}
                            className="px-3 py-1.5 bg-[#0055d4] hover:bg-[#003fa3] text-white font-extrabold text-xs rounded-xl transition cursor-pointer"
                          >
                            {isFormOpen ? "Cancel" : `+ Add Task to ${config.title}`}
                          </button>
                        </div>

                        {/* Inline Task Builder Form */}
                        {isFormOpen && (
                          <div className="p-4 bg-white border-2 border-[#0055d4] rounded-2xl flex flex-col gap-3 shadow-md animate-in fade-in duration-150">
                            <span className="text-xs font-extrabold text-blue-950">
                              {editingTaskId ? "Edit Task Definition" : `New ${config.title} Task Definition`}
                            </span>

                            <input
                              type="text"
                              placeholder="Task Title (e.g. Inspect Steering Gear Hydraulics)"
                              value={taskTitle}
                              onChange={(e) => setTaskTitle(e.target.value)}
                              className="bg-zinc-50 border border-zinc-200 p-2.5 text-xs font-semibold rounded-xl text-black"
                            />

                            <textarea
                              placeholder="Description / Operational Instructions"
                              value={taskDescription}
                              onChange={(e) => setTaskDescription(e.target.value)}
                              rows={2}
                              className="bg-zinc-50 border border-zinc-200 p-2.5 text-xs font-semibold rounded-xl text-black resize-none"
                            />

                            <div className="grid grid-cols-3 gap-2">
                              <div>
                                <label className="text-[9px] font-bold text-zinc-400 block uppercase">
                                  Frequency
                                </label>
                                <select
                                  value={taskFrequency}
                                  onChange={(e) => setTaskFrequency(e.target.value)}
                                  className="w-full bg-zinc-50 border border-zinc-200 p-2 text-[11px] font-bold rounded-lg text-black"
                                >
                                  {frequencies.map((f) => (
                                    <option key={f} value={f}>
                                      {f}
                                    </option>
                                  ))}
                                </select>
                              </div>

                              <div>
                                <label className="text-[9px] font-bold text-zinc-400 block uppercase">
                                  Severity
                                </label>
                                <select
                                  value={taskSeverity}
                                  onChange={(e) => setTaskSeverity(e.target.value)}
                                  className="w-full bg-zinc-50 border border-zinc-200 p-2 text-[11px] font-bold rounded-lg text-black"
                                >
                                  {severities.map((s) => (
                                    <option key={s} value={s}>
                                      {s}
                                    </option>
                                  ))}
                                </select>
                              </div>

                              <div>
                                <label className="text-[9px] font-bold text-zinc-400 block uppercase">
                                  Measurement
                                </label>
                                <select
                                  value={taskUnit}
                                  onChange={(e) => setTaskUnit(e.target.value)}
                                  className="w-full bg-zinc-50 border border-zinc-200 p-2 text-[11px] font-bold rounded-lg text-black"
                                >
                                  {units.map((u) => (
                                    <option key={u} value={u}>
                                      {u}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>

                            <div className="flex items-center gap-4 pt-1">
                              <label className="flex items-center gap-1.5 cursor-pointer text-[11px] font-bold text-zinc-700">
                                <input
                                  type="checkbox"
                                  checked={taskRequirePhoto}
                                  onChange={(e) => setTaskRequirePhoto(e.target.checked)}
                                  className="rounded border-zinc-300"
                                />
                                Require Photo Proof
                              </label>

                              <label className="flex items-center gap-1.5 cursor-pointer text-[11px] font-bold text-zinc-700">
                                <input
                                  type="checkbox"
                                  checked={taskRequireNotes}
                                  onChange={(e) => setTaskRequireNotes(e.target.checked)}
                                  className="rounded border-zinc-300"
                                />
                                Require Logbook Notes
                              </label>
                            </div>

                            <button
                              onClick={() => handleSaveInlineTask(config.key)}
                              className="mt-1 py-2 bg-[#0055d4] hover:bg-[#003fa3] text-white text-xs font-extrabold rounded-xl transition cursor-pointer"
                            >
                              {editingTaskId ? "Save Task Changes" : `Add Task to ${config.title}`}
                            </button>
                          </div>
                        )}

                        {/* List of Tasks in Section */}
                        <div className="flex flex-col gap-2.5">
                          {sectionTasks.length === 0 ? (
                            <div className="p-4 text-center text-[11px] text-zinc-400 italic bg-white/70 rounded-2xl border border-zinc-200">
                              (Section is empty)
                            </div>
                          ) : (
                            sectionTasks.map((t) => (
                              <div
                                key={t.id || t.title}
                                className="p-3.5 bg-white border border-zinc-200 rounded-2xl flex items-center justify-between shadow-2xs"
                              >
                                <div className="flex flex-col gap-1">
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-black">{t.title}</span>
                                    <span className="text-[9px] font-mono font-bold text-zinc-600 bg-zinc-100 px-2 py-0.5 rounded">
                                      {t.severity}
                                    </span>
                                    <span className="text-[9px] font-mono font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded">
                                      {t.unit}
                                    </span>
                                  </div>
                                  {t.description && (
                                    <span className="text-[11px] text-zinc-500 line-clamp-1">
                                      {t.description}
                                    </span>
                                  )}
                                </div>

                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => handleEditInlineTask(t)}
                                    className="text-[10px] font-bold text-[#0055d4] hover:underline cursor-pointer px-1"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => handleRemoveTask(t.id || t.title)}
                                    className="text-[10px] font-bold text-red-600 hover:underline cursor-pointer px-1"
                                  >
                                    Remove
                                  </button>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-8 py-5 border-t border-zinc-150 bg-zinc-50 flex items-center justify-between">
          <span className="text-xs text-zinc-400 font-mono">
            Automatic Versioning Enabled &bull; {tasksList.length} Tasks Defined Total
          </span>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-zinc-200 hover:bg-zinc-300 text-zinc-700 font-bold text-xs rounded-xl transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveFullTemplate}
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-[#0055d4] hover:bg-[#003fa3] text-white font-extrabold text-xs rounded-xl transition cursor-pointer shadow-md"
            >
              {isSubmitting ? "Saving Global Template..." : isUpdateMode ? "Save Changes" : "Save Global Template"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalTemplateEditorModal;
