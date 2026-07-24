import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { templatesApi, type Template } from "../../templates/api/templates.api";
import { toast } from "react-hot-toast";
import { GlobalTemplateViewModal } from "../components/GlobalTemplateViewModal";
import { GlobalTemplatePickerModal } from "../components/GlobalTemplatePickerModal";
import { GlobalTemplateEditorModal } from "../components/GlobalTemplateEditorModal";

export const GlobalTemplatesPage: React.FC = () => {
  // Modal State Control
  const [viewingTemplateId, setViewingTemplateId] = useState<string | null>(null);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [templateToEdit, setTemplateToEdit] = useState<Template | null>(null);

  // Fetch Global Templates List
  const { data: rawTemplates = [], isLoading, refetch } = useQuery({
    queryKey: ["templates"],
    queryFn: () => templatesApi.listTemplates(),
  });
  const templates: Template[] = Array.isArray(rawTemplates) ? rawTemplates : (rawTemplates as any)?.items || [];

  const globalTemplates = templates.filter((t) => (t.scope || "GLOBAL") === "GLOBAL");

  const deleteMutation = useMutation({
    mutationFn: (id: string) => templatesApi.deleteTemplate(id),
    onSuccess: () => {
      toast.success("Master Global Template deleted successfully!");
      refetch();
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to delete template");
    },
  });

  const handleDeleteTemplate = (e: React.MouseEvent, tpl: Template) => {
    e.stopPropagation();
    const id = tpl._id || tpl.id;
    if (!id) return;
    if (confirm(`Are you sure you want to delete Master Template "${tpl.name}"?`)) {
      deleteMutation.mutate(id);
    }
  };

  const handleOpenAddTemplate = () => {
    setTemplateToEdit(null);
    setIsEditorOpen(true);
  };

  const handleOpenUpdateTemplatePicker = () => {
    setIsPickerOpen(true);
  };

  const handleSelectTemplateToUpdate = (template: Template) => {
    setIsPickerOpen(false);
    setTemplateToEdit(template);
    setIsEditorOpen(true);
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto p-4 md:p-8 font-sans">
      {/* Top Header Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-3xl border border-zinc-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#0055d4] bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
              Global Governance Center
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-black tracking-tight mt-1">
            Global System Templates
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Super Admin master checklist template definitions and rank versioning configuration.
          </p>
        </div>

        {/* Right Actions: Add Template & Update Template */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleOpenUpdateTemplatePicker}
            className="px-4 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-bold rounded-xl border border-zinc-300 transition cursor-pointer flex items-center gap-1.5"
          >
            <span>✏️ Update Template</span>
          </button>
          <button
            onClick={handleOpenAddTemplate}
            className="px-5 py-2.5 bg-[#0055d4] hover:bg-[#003fa3] text-white text-xs font-extrabold rounded-xl shadow-sm transition cursor-pointer flex items-center gap-1.5"
          >
            <span>+ Add Template</span>
          </button>
        </div>
      </div>

      {/* Main Content: Clean List of Global Master Templates */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-xs font-extrabold text-zinc-400 uppercase tracking-wider">
            Active Master Templates ({globalTemplates.length})
          </h2>
          <span className="text-xs text-zinc-400 font-mono">
            Click any template to view its read-only tasks definition
          </span>
        </div>

        {isLoading ? (
          <div className="bg-white border border-zinc-200 rounded-3xl p-12 text-center text-xs text-zinc-400 italic">
            Loading master global templates...
          </div>
        ) : globalTemplates.length === 0 ? (
          <div className="bg-white border border-zinc-200 rounded-3xl p-12 text-center flex flex-col items-center justify-center gap-3">
            <span className="text-4xl">📋</span>
            <h3 className="text-base font-extrabold text-black">No Global Templates Found</h3>
            <p className="text-xs text-zinc-400 max-w-sm">
              Click "+ Add Template" above to create the first Master Global Template.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {globalTemplates.map((tpl) => {
              const templateId = tpl._id || tpl.id;

              return (
                <div
                  key={templateId}
                  onClick={() => setViewingTemplateId(templateId!)}
                  className="bg-white border border-zinc-200 rounded-3xl p-5 hover:border-[#0055d4] hover:shadow-md transition cursor-pointer flex flex-col justify-between gap-4 group relative"
                >
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded border text-purple-700 bg-purple-50 border-purple-200">
                        {tpl.rank || "Second Officer"}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded border text-emerald-700 bg-emerald-50 border-emerald-200">
                          {tpl.vesselType || "Container"}
                        </span>
                        <button
                          onClick={(e) => handleDeleteTemplate(e, tpl)}
                          title="Delete Template"
                          className="w-6 h-6 rounded-full bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 flex items-center justify-center text-xs font-bold transition cursor-pointer"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>

                    <h3 className="text-sm font-extrabold text-black group-hover:text-[#0055d4] transition mt-1">
                      {tpl.name}
                    </h3>
                    <p className="text-xs text-zinc-500 line-clamp-2">
                      {tpl.description || "Master operational checklist template."}
                    </p>
                  </div>

                  <div className="flex items-center justify-between border-t border-zinc-150 pt-3 text-[11px] font-semibold text-zinc-400">
                    <span className="flex items-center gap-1 text-zinc-600">
                      <span>📋</span> View Task Definitions
                    </span>
                    <span className="text-[#0055d4] group-hover:translate-x-1 transition font-bold">
                      Inspect →
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* View Modal (Read-Only Preview) */}
      {viewingTemplateId && (
        <GlobalTemplateViewModal
          templateId={viewingTemplateId}
          onClose={() => setViewingTemplateId(null)}
        />
      )}

      {/* Update Template Picker Modal */}
      {isPickerOpen && (
        <GlobalTemplatePickerModal
          onSelectTemplate={handleSelectTemplateToUpdate}
          onClose={() => setIsPickerOpen(false)}
        />
      )}

      {/* Single Reusable Template Editor Modal (Create & Update Modes) */}
      {isEditorOpen && (
        <GlobalTemplateEditorModal
          templateToEdit={templateToEdit}
          onClose={() => setIsEditorOpen(false)}
          onSuccess={() => {
            setIsEditorOpen(false);
            refetch();
          }}
        />
      )}
    </div>
  );
};

export default GlobalTemplatesPage;
