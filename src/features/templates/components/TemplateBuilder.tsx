import React, { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { templatesApi } from "../api/templates.api";
import { DynamicSelect } from "./DynamicSelect";
import { toast } from "react-hot-toast";

interface TaskDraft {
  id: string;
  categoryName: string;
  taskGroup: string;
  title: string;
  description: string;
  measurementUnit: string;
  frequency: string;
}

interface TemplateBuilderProps {
  defaultScope?: "GLOBAL" | "VESSEL";
  vesselId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const TemplateBuilder: React.FC<TemplateBuilderProps> = ({
  defaultScope = "GLOBAL",
  vesselId,
  onSuccess,
  onCancel,
}) => {
  const queryClient = useQueryClient();
  const [step, setStep] = useState(1);

  // Step 1: Info
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [scope, setScope] = useState<"GLOBAL" | "VESSEL">(defaultScope);
  const [vesselType, setVesselType] = useState("Container");

  // Step 2: Categories
  const [categories, setCategories] = useState<{ id: string; name: string; taskGroup: string }[]>([
    { id: "cat-1", name: "Main Engine Inspection", taskGroup: "Daily" },
  ]);
  const [newCatName, setNewCatName] = useState("");
  const [newCatGroup, setNewCatGroup] = useState("Daily");

  // Step 3: Tasks
  const [tasks, setTasks] = useState<TaskDraft[]>([
    {
      id: "task-1",
      categoryName: "Main Engine Inspection",
      taskGroup: "Daily",
      title: "Check L.O. Sump Tank Level",
      description: "Inspect dipstick level and log oil quantity.",
      measurementUnit: "bar",
      frequency: "Daily",
    },
  ]);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDesc, setTaskDesc] = useState("");
  const [taskCat, setTaskCat] = useState("Main Engine Inspection");
  const taskGroup = "Daily";
  const [taskUnit, setTaskUnit] = useState("bar");
  const [taskFreq, setTaskFreq] = useState("Daily");

  const [isPublishing, setIsPublishing] = useState(false);

  // Add Category
  const handleAddCategory = () => {
    if (!newCatName.trim()) {
      toast.error("Category name is required.");
      return;
    }
    const id = `cat-${Date.now()}`;
    setCategories([...categories, { id, name: newCatName.trim(), taskGroup: newCatGroup }]);
    if (!taskCat) setTaskCat(newCatName.trim());
    setNewCatName("");
    toast.success("Category added.");
  };

  // Add Task
  const handleAddTask = () => {
    if (!taskTitle.trim()) {
      toast.error("Task title is required.");
      return;
    }
    const newTask: TaskDraft = {
      id: `task-${Date.now()}`,
      categoryName: taskCat || categories[0]?.name || "General Inspection",
      taskGroup,
      title: taskTitle.trim(),
      description: taskDesc.trim(),
      measurementUnit: taskUnit,
      frequency: taskFreq,
    };
    setTasks([...tasks, newTask]);
    setTaskTitle("");
    setTaskDesc("");
    toast.success("Task added to draft.");
  };

  // Remove Task
  const handleRemoveTask = (id: string) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  // Publish Complete Template
  const handlePublish = async () => {
    if (!name.trim()) {
      toast.error("Template name is required.");
      return;
    }

    setIsPublishing(true);
    try {
      // 1. Create Template
      const template = await templatesApi.createTemplate({
        name: name.trim(),
        description: description.trim(),
        scope,
        vesselId,
      });

      // 2. Create Initial Version
      const version = await templatesApi.createVersion({
        templateId: template._id,
        version: "1.0.0",
        description: "Initial published template version",
      });

      // 3. Create Categories & Tasks
      for (const cat of categories) {
        const catRes = await templatesApi.createCategory({
          templateId: template._id,
          name: cat.name,
          taskGroup: cat.taskGroup,
          displayOrder: 1,
        });

        const catTasks = tasks.filter((t) => t.categoryName === cat.name);
        for (let i = 0; i < catTasks.length; i++) {
          const t = catTasks[i];
          await templatesApi.createDefinition(template._id, {
            categoryId: catRes._id,
            title: t.title,
            description: `${t.description} [Unit: ${t.measurementUnit}] [Freq: ${t.frequency}]`,
            displayOrder: i + 1,
          });
        }
      }

      // 4. Publish Version
      await templatesApi.publishVersion(version._id);

      toast.success(`Template "${name}" published successfully!`);
      queryClient.invalidateQueries({ queryKey: ["templates"] });
      if (onSuccess) onSuccess();
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to publish template.");
    } fontFinally: {
      setIsPublishing(false);
    }
  };

  return (
    <div className="bg-white border border-zinc-200 rounded-3xl p-6 md:p-8 shadow-xl flex flex-col gap-6 font-sans max-w-4xl mx-auto">
      {/* Step Indicator Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-zinc-150 pb-4">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#0055d4] bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
            Interactive Template Builder
          </span>
          <h2 className="text-xl font-extrabold text-black tracking-tight mt-1">
            {step === 1 && "Step 1: General Template Information"}
            {step === 2 && "Step 2: Define Task Categories"}
            {step === 3 && "Step 3: Add & Configure Inspection Tasks"}
            {step === 4 && "Step 4: Review & Publish Template"}
          </h2>
        </div>
        <span className="text-xs font-mono font-bold text-zinc-400 bg-zinc-100 px-3 py-1 rounded-full">
          Step {step} of 4
        </span>
      </div>

      {/* Step 1: Info */}
      {step === 1 && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-zinc-500">Template Title *</label>
            <input
              type="text"
              placeholder="e.g. Master Auxiliary Engine Maintenance Checklist"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-zinc-50 border border-zinc-200 px-3.5 py-2.5 text-xs font-semibold rounded-xl text-black focus:outline-none focus:border-[#0055d4]"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-zinc-500">Description</label>
            <textarea
              placeholder="Describe the operational scope of this template..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full bg-zinc-50 border border-zinc-200 px-3.5 py-2.5 text-xs font-semibold rounded-xl text-black"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DynamicSelect
              category="vesselTypes"
              value={vesselType}
              onChange={setVesselType}
              label="Target Vessel Type *"
            />
            <DynamicSelect
              category="scopes"
              value={scope}
              onChange={(val) => setScope(val as any)}
              label="Template Visibility Scope *"
            />
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-zinc-150">
            {onCancel ? (
              <button onClick={onCancel} className="px-4 py-2.5 bg-zinc-100 text-xs font-bold text-black rounded-xl cursor-pointer">
                Cancel
              </button>
            ) : <div />}
            <button
              onClick={() => {
                if (!name.trim()) return toast.error("Please enter a template name.");
                setStep(2);
              }}
              className="px-6 py-2.5 bg-[#0055d4] hover:bg-[#003fa3] text-white text-xs font-extrabold rounded-xl transition cursor-pointer shadow-md"
            >
              Next: Categories &rarr;
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Categories */}
      {step === 2 && (
        <div className="flex flex-col gap-5">
          <div className="p-4 bg-blue-50/60 border border-blue-150 rounded-2xl flex flex-col gap-3">
            <h4 className="text-xs font-bold text-blue-950 uppercase tracking-wider">Add New Task Category</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="Category Name (e.g. Fuel Purifiers)"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                className="bg-white border border-zinc-200 px-3 py-2 text-xs font-semibold rounded-xl text-black"
              />
              <DynamicSelect
                category="taskGroups"
                value={newCatGroup}
                onChange={setNewCatGroup}
                placeholder="Select Task Group"
              />
              <button
                onClick={handleAddCategory}
                className="py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold rounded-xl transition cursor-pointer shadow-xs"
              >
                + Add Category
              </button>
            </div>
          </div>

          <h4 className="text-xs font-bold text-black uppercase tracking-wider">Configured Categories ({categories.length})</h4>
          <div className="flex flex-col gap-2">
            {categories.map((cat) => (
              <div key={cat.id} className="p-3 bg-zinc-50 border border-zinc-200 rounded-xl flex justify-between items-center text-xs">
                <span className="font-bold text-black">{cat.name}</span>
                <span className="text-[10px] font-extrabold uppercase bg-sky-50 text-sky-700 px-2.5 py-0.5 rounded border border-sky-200">
                  {cat.taskGroup}
                </span>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-zinc-150">
            <button onClick={() => setStep(1)} className="px-4 py-2.5 bg-zinc-100 text-xs font-bold text-black rounded-xl cursor-pointer">
              &larr; Back
            </button>
            <button
              onClick={() => {
                if (categories.length === 0) return toast.error("Add at least one category.");
                setStep(3);
              }}
              className="px-6 py-2.5 bg-[#0055d4] hover:bg-[#003fa3] text-white text-xs font-extrabold rounded-xl transition cursor-pointer shadow-md"
            >
              Next: Tasks &rarr;
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Tasks Editor */}
      {step === 3 && (
        <div className="flex flex-col gap-5">
          <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-2xl flex flex-col gap-3">
            <h4 className="text-xs font-bold text-black uppercase tracking-wider">Configure New Inspection Check</h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Task Title (e.g. Check Oil Pressure)"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                className="bg-white border border-zinc-200 px-3.5 py-2.5 text-xs font-semibold rounded-xl text-black"
              />
              <select
                value={taskCat}
                onChange={(e) => setTaskCat(e.target.value)}
                className="bg-white border border-zinc-200 px-3.5 py-2.5 text-xs font-semibold rounded-xl text-black cursor-pointer"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <textarea
              placeholder="Operational inspection instructions..."
              value={taskDesc}
              onChange={(e) => setTaskDesc(e.target.value)}
              rows={2}
              className="bg-white border border-zinc-200 px-3.5 py-2 text-xs font-semibold rounded-xl text-black"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <DynamicSelect category="measurementUnits" value={taskUnit} onChange={setTaskUnit} label="Measurement Unit" />
              <DynamicSelect category="frequencies" value={taskFreq} onChange={setTaskFreq} label="Frequency" />
            </div>

            <button
              onClick={handleAddTask}
              className="py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold rounded-xl transition cursor-pointer shadow-xs mt-1"
            >
              + Add Task Definition
            </button>
          </div>

          <h4 className="text-xs font-bold text-black uppercase tracking-wider">Draft Task List ({tasks.length})</h4>
          <div className="flex flex-col gap-2">
            {tasks.map((t) => (
              <div key={t.id} className="p-3.5 bg-white border border-zinc-200 rounded-xl flex justify-between items-center text-xs shadow-2xs">
                <div className="flex flex-col gap-0.5">
                  <span className="font-bold text-black">{t.title}</span>
                  <span className="text-[10px] text-zinc-400">{t.categoryName} &bull; Unit: {t.measurementUnit} &bull; Freq: {t.frequency}</span>
                </div>
                <button
                  onClick={() => handleRemoveTask(t.id)}
                  className="px-2.5 py-1 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-[10px] font-bold border border-red-200 cursor-pointer"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-zinc-150">
            <button onClick={() => setStep(2)} className="px-4 py-2.5 bg-zinc-100 text-xs font-bold text-black rounded-xl cursor-pointer">
              &larr; Back
            </button>
            <button
              onClick={() => {
                if (tasks.length === 0) return toast.error("Add at least one task.");
                setStep(4);
              }}
              className="px-6 py-2.5 bg-[#0055d4] hover:bg-[#003fa3] text-white text-xs font-extrabold rounded-xl transition cursor-pointer shadow-md"
            >
              Next: Review &rarr;
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Review & Publish */}
      {step === 4 && (
        <div className="flex flex-col gap-5">
          <div className="p-5 bg-zinc-50 border border-zinc-200 rounded-2xl flex flex-col gap-3 text-xs">
            <h4 className="text-sm font-extrabold text-black border-b border-zinc-200 pb-2">Template Summary</h4>
            <div className="flex justify-between"><span className="font-bold text-zinc-400">Title:</span> <span className="font-bold text-black">{name}</span></div>
            <div className="flex justify-between"><span className="font-bold text-zinc-400">Scope:</span> <span className="font-extrabold text-sky-600">{scope}</span></div>
            <div className="flex justify-between"><span className="font-bold text-zinc-400">Vessel Type:</span> <span className="font-semibold text-zinc-700">{vesselType}</span></div>
            <div className="flex justify-between"><span className="font-bold text-zinc-400">Total Categories:</span> <span className="font-extrabold text-emerald-600">{categories.length}</span></div>
            <div className="flex justify-between"><span className="font-bold text-zinc-400">Total Tasks:</span> <span className="font-extrabold text-indigo-600">{tasks.length}</span></div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-zinc-150">
            <button onClick={() => setStep(3)} className="px-4 py-2.5 bg-zinc-100 text-xs font-bold text-black rounded-xl cursor-pointer">
              &larr; Back
            </button>
            <button
              onClick={handlePublish}
              disabled={isPublishing}
              className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-extrabold rounded-xl transition cursor-pointer shadow-lg"
            >
              {isPublishing ? "Publishing Version..." : "✓ Publish Template Version"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateBuilder;
