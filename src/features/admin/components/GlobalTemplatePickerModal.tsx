import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { templatesApi, type Template } from "../../templates/api/templates.api";

interface GlobalTemplatePickerModalProps {
  onSelectTemplate: (template: Template) => void;
  onClose: () => void;
}

export const GlobalTemplatePickerModal: React.FC<GlobalTemplatePickerModalProps> = ({
  onSelectTemplate,
  onClose,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [rankFilter, setRankFilter] = useState("ALL");
  const [vesselTypeFilter, setVesselTypeFilter] = useState("ALL");

  const { data: rawTemplates = [], isLoading } = useQuery({
    queryKey: ["templates"],
    queryFn: () => templatesApi.listTemplates(),
  });
  const templates: Template[] = Array.isArray(rawTemplates) ? rawTemplates : (rawTemplates as any)?.items || [];

  const { data: metaOptions } = useQuery({
    queryKey: ["meta-options"],
    queryFn: () => templatesApi.getMetaOptions(),
  });

  const ranks = metaOptions?.ranks || ["Captain", "Chief Officer", "Second Officer", "Third Officer", "Bosun", "Able Seaman", "Chief Engineer"];
  const vesselTypes = metaOptions?.vesselTypes || ["Container", "Tanker", "Bulk Carrier", "Passenger", "General Cargo"];

  const globalTemplates = templates.filter((t) => (t.scope || "GLOBAL") === "GLOBAL");

  const filteredTemplates = globalTemplates.filter((t) => {
    const matchesSearch =
      !searchTerm ||
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.rank || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.vesselType || "").toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRank = rankFilter === "ALL" || (t.rank || "").toLowerCase() === rankFilter.toLowerCase();
    const matchesVessel = vesselTypeFilter === "ALL" || (t.vesselType || "").toLowerCase() === vesselTypeFilter.toLowerCase();

    return matchesSearch && matchesRank && matchesVessel;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-zinc-200 overflow-hidden my-8 animate-in fade-in zoom-in duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-150 bg-zinc-50/70">
          <div>
            <span className="text-[10px] font-extrabold uppercase text-[#0055d4] bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
              Update Template Workflow
            </span>
            <h2 className="text-xl font-extrabold text-black tracking-tight mt-1">
              Select Template to Update
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Search and filter existing Master Global Templates by Rank and Vessel Type.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-zinc-200 hover:bg-zinc-300 text-zinc-700 text-sm font-bold transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Filters */}
        <div className="p-6 border-b border-zinc-150 bg-zinc-50/40 flex flex-col gap-3">
          <input
            type="text"
            placeholder="🔍 Search templates by title or rank..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-zinc-200 p-3 text-xs font-semibold rounded-xl text-black shadow-xs focus:border-[#0055d4] outline-none"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-wider block mb-1">
                Filter by Rank
              </label>
              <select
                value={rankFilter}
                onChange={(e) => setRankFilter(e.target.value)}
                className="w-full bg-white border border-zinc-200 p-2.5 text-xs font-semibold rounded-xl text-black"
              >
                <option value="ALL">All Ranks</option>
                {ranks.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-wider block mb-1">
                Filter by Vessel Type
              </label>
              <select
                value={vesselTypeFilter}
                onChange={(e) => setVesselTypeFilter(e.target.value)}
                className="w-full bg-white border border-zinc-200 p-2.5 text-xs font-semibold rounded-xl text-black"
              >
                <option value="ALL">All Vessel Types</option>
                {vesselTypes.map((vt) => (
                  <option key={vt} value={vt}>
                    {vt}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Templates List */}
        <div className="p-6 max-h-[50vh] overflow-y-auto flex flex-col gap-2.5">
          {isLoading ? (
            <div className="p-8 text-center text-xs text-zinc-400 italic">
              Loading global templates...
            </div>
          ) : filteredTemplates.length === 0 ? (
            <div className="p-8 text-center text-xs text-zinc-400 italic border border-dashed border-zinc-200 rounded-2xl">
              No matching templates found for your search and filter criteria.
            </div>
          ) : (
            filteredTemplates.map((tpl) => (
              <div
                key={tpl._id || tpl.id}
                onClick={() => onSelectTemplate(tpl)}
                className="p-4 bg-white border border-zinc-200 rounded-2xl hover:border-[#0055d4] hover:bg-blue-50/50 hover:shadow-xs transition cursor-pointer flex items-center justify-between"
              >
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold text-black">{tpl.name}</span>
                    {tpl.rank && (
                      <span className="text-[9px] font-extrabold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                        {tpl.rank}
                      </span>
                    )}
                    {tpl.vesselType && (
                      <span className="text-[9px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {tpl.vesselType}
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-zinc-500 line-clamp-1">
                    {tpl.description || "Master operational template definitions."}
                  </span>
                </div>

                <span className="px-3.5 py-1.5 bg-[#0055d4] hover:bg-[#003fa3] text-white font-bold text-xs rounded-xl transition">
                  Edit Template →
                </span>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-zinc-150 bg-zinc-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-zinc-200 hover:bg-zinc-300 text-zinc-700 font-bold text-xs rounded-xl transition cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default GlobalTemplatePickerModal;
