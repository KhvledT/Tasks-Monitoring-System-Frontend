import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../../shared/hooks/useAuth";
import { useActiveVessel } from "../../../shared/hooks/useActiveVessel";
import { templatesApi, type Template } from "../api/templates.api";
import { TemplateBuilder } from "../components/TemplateBuilder";
import { toast } from "react-hot-toast";

const VESSEL_TYPES = [
  "All Fleet Types",
  "Container",
  "Tanker",
  "Bulk Carrier",
  "Passenger",
  "General Cargo",
];

const MARITIME_RANKS = [
  "Captain",
  "Chief Officer",
  "Second Officer",
  "Third Officer",
  "Bosun",
  "Able Seaman",
  "Cadet",
];

export const TemplatesPage: React.FC = () => {
  const { user } = useAuth();
  const { activeVesselId, activeVessel } = useActiveVessel();
  const queryClient = useQueryClient();

  const isSuperAdmin = user?.role === "SUPER_ADMIN";
  const isCaptain = user?.role === "ADMIN";

  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"templates" | "assignments">("templates");
  const [vesselFilter, setVesselFilter] = useState("All Fleet Types");
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);

  // Category States
  const [newCatName, setNewCatName] = useState("");
  const [newCatGroup, setNewCatGroup] = useState("Daily");

  // Task Definition States
  const [selectedCatId, setSelectedCatId] = useState<string | null>(null);
  const [newDefTitle, setNewDefTitle] = useState("");
  const [newDefDesc, setNewDefDesc] = useState("");

  // Assignment States
  const [assignRank, setAssignRank] = useState("Second Officer");
  const [assignVesselType, setAssignVesselType] = useState("Container");

  // Queries
  const { data: rawTemplates = [], isLoading: isTemplatesLoading } = useQuery({
    queryKey: ["templates"],
    queryFn: () => templatesApi.listTemplates(),
  });
  const templates: Template[] = Array.isArray(rawTemplates) ? rawTemplates : (rawTemplates as any)?.items || [];

  // Master Global Templates
  const filteredTemplates = React.useMemo(() => {
    let list = templates;
    if (isSuperAdmin) {
      list = templates.filter((t) => (t.scope || "GLOBAL") === "GLOBAL");
    } else if (activeVesselId) {
      list = templates.filter((t) => t.scope === "VESSEL" && String(t.vesselId) === String(activeVesselId));
    }
    if (vesselFilter !== "All Fleet Types") {
      list = list.filter((t) => (t.vesselType || "").toLowerCase().includes(vesselFilter.toLowerCase()));
    }
    return list;
  }, [templates, isSuperAdmin, activeVesselId, vesselFilter]);

  // Auto select first template if none selected
  useEffect(() => {
    if (!selectedTemplateId && filteredTemplates.length > 0) {
      const firstId = filteredTemplates[0]._id || filteredTemplates[0].id;
      if (firstId) setSelectedTemplateId(firstId);
    }
  }, [filteredTemplates, selectedTemplateId]);

  // Vessel-Scoped Working Templates for Captain
  const vesselWorkingTemplates = React.useMemo(() => {
    if (!activeVesselId) return [];
    return templates.filter((t) => t.scope === "VESSEL" && String(t.vesselId) === String(activeVesselId));
  }, [templates, activeVesselId]);

  // Master Global Templates for Captain Inheritance Picker
  const globalMasterTemplates = React.useMemo(() => {
    return templates.filter((t) => t.scope === "GLOBAL");
  }, [templates]);

  const { data: details, isLoading: isDetailsLoading } = useQuery({
    queryKey: ["template-details", selectedTemplateId],
    queryFn: () => templatesApi.getTemplateDetails(selectedTemplateId!),
    enabled: !!selectedTemplateId,
  });

  const { data: versions = [] } = useQuery({
    queryKey: ["template-versions", selectedTemplateId],
    queryFn: () => templatesApi.listVersions(selectedTemplateId!),
    enabled: !!selectedTemplateId && isSuperAdmin,
  });

  const { data: assignments = [] } = useQuery({
    queryKey: ["assignments"],
    queryFn: () => templatesApi.listAssignments(),
    enabled: isSuperAdmin,
  });

  // Mutations
  const inheritMutation = useMutation({
    mutationFn: (globalTemplateId: string) => templatesApi.inheritGlobalTemplate(globalTemplateId),
    onSuccess: (inherited) => {
      toast.success("Master Global Template inherited successfully for vessel!");
      setSelectedTemplateId(inherited._id);
      queryClient.invalidateQueries({ queryKey: ["templates"] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to inherit global template");
    },
  });

  const deleteTemplateMutation = useMutation({
    mutationFn: (id: string) => templatesApi.deleteTemplate(id),
    onSuccess: () => {
      toast.success("Template deleted");
      setSelectedTemplateId(null);
      queryClient.invalidateQueries({ queryKey: ["templates"] });
    },
  });

  const publishVersionMutation = useMutation({
    mutationFn: (versionId: string) => templatesApi.publishVersion(versionId),
    onSuccess: () => {
      toast.success("Template version published successfully!");
      queryClient.invalidateQueries({ queryKey: ["template-versions", selectedTemplateId] });
      queryClient.invalidateQueries({ queryKey: ["template-details", selectedTemplateId] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to publish version");
    },
  });

  const createCategoryMutation = useMutation({
    mutationFn: (data: { templateId: string; name: string; taskGroup: string; displayOrder: number }) =>
      templatesApi.createCategory(data),
    onSuccess: () => {
      toast.success("Category added");
      setNewCatName("");
      queryClient.invalidateQueries({ queryKey: ["template-details", selectedTemplateId] });
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: (catId: string) => templatesApi.deleteCategory(selectedTemplateId!, catId),
    onSuccess: () => {
      toast.success("Category deleted");
      queryClient.invalidateQueries({ queryKey: ["template-details", selectedTemplateId] });
    },
  });

  const createDefinitionMutation = useMutation({
    mutationFn: (data: { categoryId: string; title: string; description?: string; displayOrder: number }) =>
      templatesApi.createDefinition(selectedTemplateId!, data),
    onSuccess: () => {
      toast.success("Task definition added");
      setNewDefTitle("");
      setNewDefDesc("");
      setSelectedCatId(null);
      queryClient.invalidateQueries({ queryKey: ["template-details", selectedTemplateId] });
    },
  });

  const deleteDefinitionMutation = useMutation({
    mutationFn: (defId: string) => templatesApi.deleteDefinition(selectedTemplateId!, defId),
    onSuccess: () => {
      toast.success("Task definition deleted");
      queryClient.invalidateQueries({ queryKey: ["template-details", selectedTemplateId] });
    },
  });

  const createAssignmentMutation = useMutation({
    mutationFn: (data: { templateId: string; templateVersionId: string; rank: string; vesselType: string }) =>
      templatesApi.createAssignment(data),
    onSuccess: () => {
      toast.success("Assignment mapping created");
      queryClient.invalidateQueries({ queryKey: ["assignments"] });
    },
  });

  const deleteAssignmentMutation = useMutation({
    mutationFn: (assignmentId: string) => templatesApi.deleteAssignment(assignmentId),
    onSuccess: () => {
      toast.success("Assignment mapping deleted");
      queryClient.invalidateQueries({ queryKey: ["assignments"] });
    },
  });

  const handleAddCategory = () => {
    if (!selectedTemplateId || !newCatName) return;
    createCategoryMutation.mutate({
      templateId: selectedTemplateId,
      name: newCatName,
      taskGroup: newCatGroup,
      displayOrder: (details?.categories?.length || 0) + 1,
    });
  };

  const handleAddDefinition = (categoryId: string) => {
    if (!newDefTitle) return;
    createDefinitionMutation.mutate({
      categoryId,
      title: newDefTitle,
      description: newDefDesc,
      displayOrder: (details?.definitions?.length || 0) + 1,
    });
  };

  const handleCreateAssignment = () => {
    if (!selectedTemplateId) {
      toast.error("Please select a Master Global Template");
      return;
    }
    const versionId = versions[0]?._id;
    if (!versionId) {
      toast.error("No version available for selected template");
      return;
    }
    createAssignmentMutation.mutate({
      templateId: selectedTemplateId,
      templateVersionId: versionId,
      rank: assignRank,
      vesselType: assignVesselType,
    });
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto p-4 md:p-8 font-sans">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#0055d4] bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
              {isSuperAdmin ? "Global Master Governance" : "Shipboard Vessel Template Editor"}
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-black tracking-tight mt-1">
            {isSuperAdmin ? "Global Master Checklist Templates & Versioning" : "Vessel Working Template Customization"}
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            {isSuperAdmin
              ? "Create, version, publish, and govern Master Global Templates across all vessel types and rank assignments."
              : `Inherit Master Global Templates for ${activeVessel?.name || "your vessel"} and customize task definitions without altering the master copy.`}
          </p>
        </div>

        {isSuperAdmin && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsBuilderOpen(true)}
              className="px-4 py-2.5 bg-[#0055d4] hover:bg-[#003fa3] text-xs font-bold text-white rounded-xl transition cursor-pointer shadow-sm flex items-center gap-1.5"
            >
              <span>+ Create Master Template</span>
            </button>
          </div>
        )}
      </div>

      {/* Super Admin Navigation Tabs */}
      {isSuperAdmin && (
        <div className="flex items-center justify-between border-b border-zinc-200 pb-1">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("templates")}
              className={`px-5 py-2.5 text-xs font-extrabold rounded-t-xl transition cursor-pointer ${
                activeTab === "templates"
                  ? "bg-white border-t-2 border-x border-[#0055d4] text-[#0055d4] shadow-xs"
                  : "text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100"
              }`}
            >
              📋 Master Global Templates & Tasks ({filteredTemplates.length})
            </button>
            <button
              onClick={() => setActiveTab("assignments")}
              className={`px-5 py-2.5 text-xs font-extrabold rounded-t-xl transition cursor-pointer ${
                activeTab === "assignments"
                  ? "bg-white border-t-2 border-x border-[#0055d4] text-[#0055d4] shadow-xs"
                  : "text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100"
              }`}
            >
              🔗 Rank & Vessel Type Assignments ({assignments.length})
            </button>
          </div>

          {/* Vessel Type Filter Pills */}
          {activeTab === "templates" && (
            <div className="hidden md:flex items-center gap-1 bg-zinc-100 p-1 rounded-xl">
              {VESSEL_TYPES.map((type) => (
                <button
                  key={type}
                  onClick={() => setVesselFilter(type)}
                  className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition cursor-pointer ${
                    vesselFilter === type ? "bg-white text-black shadow-xs" : "text-zinc-500 hover:text-zinc-800"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Builder Modal */}
      {isBuilderOpen && (
        <TemplateBuilder
          defaultScope={isSuperAdmin ? "GLOBAL" : "VESSEL"}
          vesselId={activeVesselId || undefined}
          onCancel={() => setIsBuilderOpen(false)}
          onSuccess={() => {
            setIsBuilderOpen(false);
            queryClient.invalidateQueries({ queryKey: ["templates"] });
          }}
        />
      )}

      {/* CAPTAIN INHERITANCE BANNER & SELECTION */}
      {isCaptain && (
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-950 text-white p-6 rounded-3xl shadow-md border border-blue-800 flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-white/10 pb-3">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-sky-300 bg-white/10 px-2.5 py-0.5 rounded border border-white/10">
                Master Template Inheritance Engine
              </span>
              <h2 className="text-lg font-black text-white tracking-tight mt-1">
                Vessel Working Copy: {activeVessel?.name || "VIP Vessel"}
              </h2>
            </div>
            <span className="text-xs font-mono text-sky-200 bg-sky-950 px-3 py-1 rounded-full border border-sky-800">
              {vesselWorkingTemplates.length > 0 ? "✓ Inherited Working Copy Active" : "⚠️ Needs Global Template Inheritance"}
            </span>
          </div>

          {vesselWorkingTemplates.length === 0 ? (
            <div className="flex flex-col gap-3 bg-white/5 p-4 rounded-2xl border border-white/10">
              <span className="text-xs font-bold text-sky-200">
                Select a Master Global Template to inherit for {activeVessel?.name || "your ship"}:
              </span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {globalMasterTemplates.map((gt) => (
                  <div key={gt._id} className="bg-white/10 p-3.5 rounded-xl flex flex-col justify-between gap-3 border border-white/10 hover:bg-white/15 transition">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-sky-300">{gt.vesselType || "All Fleet"}</span>
                      <h4 className="text-xs font-bold text-white mt-1">{gt.name}</h4>
                      <p className="text-[11px] text-sky-100/70 mt-1 line-clamp-2">{gt.description}</p>
                    </div>
                    <button
                      onClick={() => inheritMutation.mutate(gt._id)}
                      disabled={inheritMutation.isPending}
                      className="px-3 py-1.5 bg-sky-400 hover:bg-sky-300 text-blue-950 font-black text-xs rounded-lg transition cursor-pointer text-center"
                    >
                      {inheritMutation.isPending ? "Inheriting..." : "Inherit Master Template →"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between bg-white/5 p-4 rounded-2xl border border-white/10">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🛡️</span>
                <div className="flex flex-col">
                  <span className="text-xs font-extrabold text-white">
                    Working Copy: {vesselWorkingTemplates[0].name}
                  </span>
                  <span className="text-[11px] text-sky-200/80 font-mono">
                    Scope: VESSEL &bull; Vessel ID: {activeVesselId} &bull; Inherited Version: 1.0.0 (Customizable by Captain)
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedTemplateId(vesselWorkingTemplates[0]._id)}
                className="px-4 py-2 bg-white text-blue-950 font-black text-xs rounded-xl hover:bg-sky-100 transition cursor-pointer"
              >
                Open Customizer Editor
              </button>
            </div>
          )}
        </div>
      )}

      {/* SUPER ADMIN ASSIGNMENTS TAB */}
      {isSuperAdmin && activeTab === "assignments" ? (
        <div className="bg-white border border-zinc-200 rounded-3xl p-6 shadow-sm flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-zinc-150 pb-4">
            <div>
              <h3 className="text-lg font-extrabold text-black">Rank & Vessel Type Template Mappings</h3>
              <p className="text-xs text-zinc-400">Map maritime ranks and vessel types to default Master Global Templates.</p>
            </div>
          </div>

          {/* Create Assignment Form */}
          <div className="bg-zinc-50 border border-zinc-200 p-4 rounded-2xl flex flex-col gap-3">
            <span className="text-xs font-bold text-black">+ Create Rank & Vessel Assignment</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <select
                value={assignRank}
                onChange={(e) => setAssignRank(e.target.value)}
                className="bg-white border border-zinc-200 p-2.5 text-xs font-semibold rounded-xl text-black"
              >
                {MARITIME_RANKS.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
              <select
                value={assignVesselType}
                onChange={(e) => setAssignVesselType(e.target.value)}
                className="bg-white border border-zinc-200 p-2.5 text-xs font-semibold rounded-xl text-black"
              >
                {VESSEL_TYPES.filter((vt) => vt !== "All Fleet Types").map((vt) => (
                  <option key={vt} value={vt}>{vt}</option>
                ))}
              </select>
              <button
                onClick={handleCreateAssignment}
                disabled={createAssignmentMutation.isPending}
                className="py-2.5 bg-[#0055d4] hover:bg-[#003fa3] text-xs font-bold text-white rounded-xl transition cursor-pointer"
              >
                Create Mapping
              </button>
            </div>
          </div>

          {/* Assignments List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {assignments.map((as: any) => {
              const matchedTpl = templates.find((t) => String(t._id) === String(as.templateId));
              return (
                <div key={as._id} className="p-4 bg-zinc-50 border border-zinc-200 rounded-2xl flex flex-col justify-between gap-3">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-blue-900 bg-blue-100 px-2.5 py-0.5 rounded border border-blue-200">
                        {as.rank}
                      </span>
                      <span className="text-xs font-bold text-zinc-600 bg-zinc-200 px-2 py-0.5 rounded">
                        {as.vesselType}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-black mt-2">{matchedTpl?.name || "Global Master Template"}</h4>
                  </div>
                  <button
                    onClick={() => deleteAssignmentMutation.mutate(as._id)}
                    className="text-[10px] font-bold text-red-600 hover:underline self-end cursor-pointer"
                  >
                    Delete Mapping
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* TEMPLATES LIST & DETAILS GOVERNANCE GRID */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Master Template Roster */}
          <div className="lg:col-span-1 flex flex-col gap-4">
            <div className="bg-white border border-zinc-200 rounded-3xl p-5 shadow-sm">
              <h3 className="text-sm font-bold text-black border-b border-zinc-150 pb-3 mb-4 flex items-center justify-between">
                <span>{isSuperAdmin ? "Master Global Templates" : "Vessel Templates"}</span>
                <span className="text-xs font-mono text-zinc-400">({filteredTemplates.length})</span>
              </h3>

              {isTemplatesLoading ? (
                <p className="text-xs text-zinc-400 italic">Loading master templates...</p>
              ) : filteredTemplates.length === 0 ? (
                <p className="text-xs text-zinc-400 italic">No templates found for filter.</p>
              ) : (
                <div className="flex flex-col gap-2.5">
                  {filteredTemplates.map((tpl) => {
                    const currentId = tpl._id || tpl.id;
                    const isSelected = selectedTemplateId === currentId;
                    return (
                      <div
                        key={currentId}
                        onClick={() => { if (currentId) setSelectedTemplateId(currentId); }}
                        className={`p-4 rounded-2xl border transition cursor-pointer flex flex-col gap-1.5 ${
                          isSelected
                            ? "bg-blue-50/80 border-[#0055d4] shadow-xs"
                            : "bg-zinc-50/70 border-zinc-200 hover:bg-zinc-100"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-extrabold text-black truncate max-w-[190px]">{tpl.name}</span>
                          <span
                            className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded border ${
                              tpl.scope === "GLOBAL"
                                ? "bg-purple-100 text-purple-800 border-purple-200"
                                : "bg-emerald-100 text-emerald-800 border-emerald-200"
                            }`}
                          >
                            {tpl.vesselType || tpl.scope}
                          </span>
                        </div>
                        <span className="text-[11px] text-zinc-500 line-clamp-2">{tpl.description || "Master operational checklist template."}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Right: Master Template Details & Full Taskset Editor */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {selectedTemplateId && details ? (
              <div className="bg-white border border-zinc-200 rounded-3xl p-6 shadow-sm flex flex-col gap-6">
                {/* Header Control Panel */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-zinc-150 pb-5">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-extrabold uppercase text-[#0055d4] bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
                        {details.template.scope === "GLOBAL" ? "Master Global Governance" : "Vessel Working Copy"}
                      </span>
                      {details.template.vesselType && (
                        <span className="text-[10px] font-extrabold uppercase text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded border border-purple-200">
                          {details.template.vesselType}
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-extrabold text-black mt-1 tracking-tight">{details.template.name}</h3>
                    <p className="text-xs text-zinc-400 mt-0.5">{details.template.description}</p>
                  </div>

                  {isSuperAdmin && (
                    <div className="flex items-center gap-2">
                      {versions.length > 0 && versions[0].status === "DRAFT" ? (
                        <button
                          onClick={() => publishVersionMutation.mutate(versions[0]._id)}
                          disabled={publishVersionMutation.isPending}
                          className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition cursor-pointer shadow-xs"
                        >
                          Publish Version v{versions[0].version}
                        </button>
                      ) : (
                        <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                          ✓ Version 1.0.0 Published
                        </span>
                      )}
                      <button
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete Master Template "${details.template.name}"?`)) {
                            deleteTemplateMutation.mutate(details.template._id);
                          }
                        }}
                        className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs rounded-xl border border-red-200 transition cursor-pointer"
                      >
                        Delete Template
                      </button>
                    </div>
                  )}
                </div>

                {/* Add Category Form */}
                <div className="bg-zinc-50 border border-zinc-200 p-4 rounded-2xl flex flex-col gap-3">
                  <span className="text-xs font-extrabold text-black">+ Add Category to Master Template</span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input
                      type="text"
                      placeholder="Category Name (e.g. Navigation & Bridge Prep)"
                      value={newCatName}
                      onChange={(e) => setNewCatName(e.target.value)}
                      className="bg-white border border-zinc-200 p-2.5 text-xs font-semibold rounded-xl text-black"
                    />
                    <select
                      value={newCatGroup}
                      onChange={(e) => setNewCatGroup(e.target.value)}
                      className="bg-white border border-zinc-200 p-2.5 text-xs font-semibold rounded-xl text-black"
                    >
                      <option value="Daily">Daily</option>
                      <option value="Weekly">Weekly</option>
                      <option value="Monthly">Monthly</option>
                      <option value="SigningOn">SigningOn</option>
                    </select>
                    <button
                      onClick={handleAddCategory}
                      disabled={createCategoryMutation.isPending}
                      className="py-2.5 bg-[#0055d4] hover:bg-[#003fa3] text-xs font-bold text-white rounded-xl transition cursor-pointer"
                    >
                      Add Category
                    </button>
                  </div>
                </div>

                {/* Categories & Full Tasks Editor */}
                <div className="flex flex-col gap-5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-extrabold text-zinc-500 uppercase tracking-wider">
                      Master Categories & Tasks ({(details.categories || []).length} Categories, {(details.definitions || details.tasks || []).length} Tasks)
                    </h4>
                  </div>

                  {isDetailsLoading ? (
                    <p className="text-xs text-zinc-400 italic">Loading tasks...</p>
                  ) : (details.categories || []).length === 0 ? (
                    <div className="p-8 border border-dashed border-zinc-200 rounded-2xl text-center text-zinc-400 text-xs">
                      No categories created yet for this master template. Use the form above to add the first category.
                    </div>
                  ) : (
                    (details.categories || []).map((cat) => {
                      const allDefs = details.definitions || details.tasks || [];
                      const catTasks = allDefs.filter((d: any) => String(d.categoryId) === String(cat._id));
                      return (
                        <div key={cat._id} className="border border-zinc-200 rounded-2xl p-5 flex flex-col gap-4 bg-zinc-50/50">
                          <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-extrabold text-black">{cat.name}</span>
                              <span className="text-[10px] font-extrabold text-blue-800 bg-blue-100 px-2.5 py-0.5 rounded-full border border-blue-200">
                                {cat.taskGroup}
                              </span>
                            </div>
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => setSelectedCatId(selectedCatId === cat._id ? null : cat._id)}
                                className="text-xs font-bold text-[#0055d4] hover:underline cursor-pointer"
                              >
                                {selectedCatId === cat._id ? "Close Task Form" : "+ Add Task to Category"}
                              </button>
                              <button
                                onClick={() => deleteCategoryMutation.mutate(cat._id)}
                                className="text-[11px] font-bold text-red-600 hover:underline cursor-pointer"
                              >
                                Delete Category
                              </button>
                            </div>
                          </div>

                          {/* Add Task Form inside Category */}
                          {selectedCatId === cat._id && (
                            <div className="p-4 bg-white border border-blue-200 rounded-2xl flex flex-col gap-3 shadow-xs">
                              <span className="text-xs font-bold text-blue-950">Add Operational Task to {cat.name}</span>
                              <input
                                type="text"
                                placeholder="Task Title (e.g. Test Steering Gear Dual Pumps)"
                                value={newDefTitle}
                                onChange={(e) => setNewDefTitle(e.target.value)}
                                className="bg-zinc-50 border border-zinc-200 p-2.5 text-xs font-semibold rounded-xl text-black"
                              />
                              <input
                                type="text"
                                placeholder="Task Description & Instructions"
                                value={newDefDesc}
                                onChange={(e) => setNewDefDesc(e.target.value)}
                                className="bg-zinc-50 border border-zinc-200 p-2.5 text-xs font-semibold rounded-xl text-black"
                              />
                              <button
                                onClick={() => handleAddDefinition(cat._id)}
                                disabled={createDefinitionMutation.isPending}
                                className="py-2 bg-[#0055d4] hover:bg-[#003fa3] text-xs font-bold text-white rounded-xl cursor-pointer self-end px-5"
                              >
                                Save Task Definition
                              </button>
                            </div>
                          )}

                          {/* Tasks Listing */}
                          <div className="flex flex-col gap-2.5">
                            {catTasks.length === 0 ? (
                              <span className="text-xs text-zinc-400 italic">No tasks in this category. Click "+ Add Task to Category" above.</span>
                            ) : (
                              catTasks.map((task: any) => (
                                <div key={task._id || task.id} className="p-3.5 bg-white border border-zinc-200 rounded-xl flex items-center justify-between shadow-2xs">
                                  <div className="flex flex-col gap-1">
                                    <div className="flex items-center gap-2">
                                      <span className="text-xs font-bold text-black">{task.title}</span>
                                      {task.frequency && (
                                        <span className="text-[9px] font-mono font-bold text-zinc-600 bg-zinc-100 px-2 py-0.5 rounded border border-zinc-200">
                                          {task.frequency}
                                        </span>
                                      )}
                                      {task.severity && (
                                        <span
                                          className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border ${
                                            task.severity === "Critical"
                                              ? "bg-red-50 text-red-700 border-red-200"
                                              : "bg-amber-50 text-amber-700 border-amber-200"
                                          }`}
                                        >
                                          {task.severity}
                                        </span>
                                      )}
                                    </div>
                                    {task.description && <span className="text-[11px] text-zinc-500">{task.description}</span>}
                                  </div>
                                  <button
                                    onClick={() => deleteDefinitionMutation.mutate(task._id || task.id)}
                                    className="text-xs font-bold text-red-600 hover:underline cursor-pointer px-2"
                                  >
                                    Delete Task
                                  </button>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white border border-zinc-200 rounded-3xl p-12 text-center flex flex-col items-center justify-center gap-3 shadow-sm">
                <span className="text-4xl">📋</span>
                <h4 className="text-base font-extrabold text-black">No Master Template Selected</h4>
                <p className="text-xs text-zinc-400 max-w-md">
                  Select a Master Global Template from the roster on the left or create a new template using the "+ Create Master Template" button.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplatesPage;
