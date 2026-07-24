import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { templatesApi } from "../../templates/api/templates.api";

interface GlobalTemplateViewModalProps {
  templateId: string;
  onClose: () => void;
}

export const GlobalTemplateViewModal: React.FC<GlobalTemplateViewModalProps> = ({
  templateId,
  onClose,
}) => {
  const [selectedTaskDetail, setSelectedTaskDetail] = useState<any | null>(null);

  const { data: details, isLoading } = useQuery({
    queryKey: ["template-details", templateId],
    queryFn: () => templatesApi.getTemplateDetails(templateId),
    enabled: !!templateId,
  });

  const template = details?.template;
  const categories = details?.categories || [];
  const tasks = details?.definitions || details?.tasks || [];

  const taskGroups = [
    { title: "Daily Tasks", key: "Daily", icon: "☀️", color: "text-amber-600 bg-amber-50 border-amber-200" },
    { title: "Weekly Tasks", key: "Weekly", icon: "📅", color: "text-blue-600 bg-blue-50 border-blue-200" },
    { title: "Monthly Tasks", key: "Monthly", icon: "🗓️", color: "text-purple-600 bg-purple-50 border-purple-200" },
    { title: "On Sign Tasks", key: "SigningOn", icon: "⚓", color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-zinc-200 overflow-hidden my-8 animate-in fade-in zoom-in duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-150 bg-zinc-50/70">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase text-[#0055d4] bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
                Read-Only Preview
              </span>
              {template?.rank && (
                <span className="text-[10px] font-extrabold uppercase text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded border border-purple-200">
                  {template.rank}
                </span>
              )}
              {template?.vesselType && (
                <span className="text-[10px] font-extrabold uppercase text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                  {template.vesselType}
                </span>
              )}
            </div>
            <h2 className="text-xl font-extrabold text-black tracking-tight mt-1">
              {template?.name || "Global Master Template"}
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              {template?.description || "Master operational template definitions across frequencies."}
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
        <div className="p-6 flex flex-col gap-6 max-h-[75vh] overflow-y-auto">
          {isLoading ? (
            <div className="p-12 text-center text-xs text-zinc-400 italic">
              Loading template task definitions...
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {taskGroups.map((group) => {
                const groupCats = categories.filter((c) => {
                  const g = (c.taskGroup || "").toLowerCase();
                  const target = group.key.toLowerCase();
                  if (target.includes("sign") || target === "signingon") return g.includes("sign");
                  return g === target;
                });
                const groupCatIds = groupCats.map((c) => String(c._id || c.id));
                const groupTasks = tasks.filter((t: any) => groupCatIds.includes(String(t.categoryId)));

                return (
                  <div
                    key={group.key}
                    className="border border-zinc-200 rounded-2xl p-4 bg-zinc-50/40 flex flex-col gap-3"
                  >
                    <div className="flex items-center justify-between border-b border-zinc-200 pb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="text-base">{group.icon}</span>
                        <h3 className="text-xs font-extrabold text-black uppercase tracking-wider">
                          {group.title}
                        </h3>
                      </div>
                      <span
                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${group.color}`}
                      >
                        {groupTasks.length} Tasks
                      </span>
                    </div>

                    {groupTasks.length === 0 ? (
                      <div className="p-4 text-center text-[11px] text-zinc-400 italic bg-white rounded-xl border border-zinc-150">
                        No tasks assigned for this frequency.
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2">
                        {groupTasks.map((t: any) => (
                          <div
                            key={t._id || t.id}
                            onClick={() => setSelectedTaskDetail(t)}
                            className="p-3 bg-white border border-zinc-200 rounded-xl hover:border-[#0055d4] hover:shadow-xs transition cursor-pointer flex items-center justify-between"
                          >
                            <div className="flex flex-col gap-0.5">
                              <span className="text-xs font-bold text-black">{t.title}</span>
                              {t.description && (
                                <span className="text-[10px] text-zinc-400 line-clamp-1">
                                  {t.description}
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] font-extrabold text-[#0055d4] hover:underline">
                              Inspect Definition →
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-zinc-150 bg-zinc-50 flex justify-end items-center gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-zinc-800 hover:bg-black text-white font-bold text-xs rounded-xl transition cursor-pointer"
          >
            Close Preview
          </button>
        </div>
      </div>

      {/* Task Definition Detail Modal */}
      {selectedTaskDetail && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-zinc-200 overflow-hidden animate-in fade-in zoom-in duration-150">
            <div className="px-6 py-4 border-b border-zinc-150 bg-blue-50/60 flex justify-between items-center">
              <div>
                <span className="text-[9px] font-extrabold uppercase text-[#0055d4] tracking-widest">
                  Task Definition Details
                </span>
                <h3 className="text-base font-extrabold text-black">
                  {selectedTaskDetail.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedTaskDetail(null)}
                className="w-7 h-7 flex items-center justify-center rounded-full bg-white text-zinc-600 hover:text-black font-bold text-xs transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 flex flex-col gap-4 text-xs font-sans">
              <div>
                <span className="font-bold text-zinc-400 uppercase text-[10px] tracking-wider block mb-1">
                  Description & Operational Instructions
                </span>
                <p className="text-zinc-800 bg-zinc-50 p-3 rounded-xl border border-zinc-200 leading-relaxed">
                  {selectedTaskDetail.description || "No specific instructions provided."}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-zinc-50 p-3 rounded-xl border border-zinc-200">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase block">Frequency</span>
                  <span className="text-xs font-extrabold text-black mt-0.5 block">
                    {selectedTaskDetail.frequency || "Daily"}
                  </span>
                </div>
                <div className="bg-zinc-50 p-3 rounded-xl border border-zinc-200">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase block">Severity Level</span>
                  <span className="text-xs font-extrabold text-amber-700 mt-0.5 block">
                    {selectedTaskDetail.severity || "Medium"}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="bg-zinc-50 p-2.5 rounded-xl border border-zinc-200">
                  <span className="text-[9px] font-bold text-zinc-400 uppercase block">Required Measurement</span>
                  <span className="text-xs font-extrabold text-blue-900 mt-0.5 block">
                    {selectedTaskDetail.unit || "None Required"}
                  </span>
                </div>
                <div className="bg-zinc-50 p-2.5 rounded-xl border border-zinc-200">
                  <span className="text-[9px] font-bold text-zinc-400 uppercase block">Required Photo</span>
                  <span className="text-xs font-extrabold text-emerald-800 mt-0.5 block">
                    {selectedTaskDetail.requirePhoto ? "Mandatory Proof" : "Optional"}
                  </span>
                </div>
                <div className="bg-zinc-50 p-2.5 rounded-xl border border-zinc-200">
                  <span className="text-[9px] font-bold text-zinc-400 uppercase block">Required Notes</span>
                  <span className="text-xs font-extrabold text-purple-900 mt-0.5 block">
                    {selectedTaskDetail.requireNotes ? "Mandatory" : "Optional"}
                  </span>
                </div>
              </div>
            </div>

            <div className="px-6 py-3 border-t border-zinc-150 bg-zinc-50 flex justify-end">
              <button
                onClick={() => setSelectedTaskDetail(null)}
                className="px-4 py-1.5 bg-blue-900 hover:bg-blue-950 text-white font-bold text-xs rounded-xl transition cursor-pointer"
              >
                Close Task Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GlobalTemplateViewModal;
