import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { templatesApi, type TemplateVersion } from "../api/templates.api";

interface TemplateVersionDiffModalProps {
  templateId?: string;
  versions: TemplateVersion[];
  isOpen: boolean;
  onClose: () => void;
}

export const TemplateVersionDiffModal: React.FC<TemplateVersionDiffModalProps> = ({
  versions,
  isOpen,
  onClose,
}) => {
  const [versionAId, setVersionAId] = useState<string>(versions[0]?._id || "");
  const [versionBId, setVersionBId] = useState<string>(versions[1]?._id || versions[0]?._id || "");

  const { data: diffResult, isLoading, error } = useQuery({
    queryKey: ["version-diff", versionAId, versionBId],
    queryFn: () => templatesApi.compareVersions(versionAId, versionBId),
    enabled: isOpen && !!versionAId && !!versionBId && versionAId !== versionBId,
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-4 overflow-y-auto font-sans">
      <div className="bg-white border border-zinc-200 rounded-3xl w-full max-w-4xl shadow-2xl p-6 flex flex-col gap-6 my-8 animate-in fade-in zoom-in duration-150">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-150 pb-4">
          <div>
            <span className="text-[10px] font-extrabold text-[#0055d4] uppercase tracking-wider bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
              Template Version Comparator
            </span>
            <h2 className="text-xl font-extrabold text-black tracking-tight mt-1">
              Visual Version Diff & Audit
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Compare operational task definitions, categories, and severity changes between two template versions.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-600 font-bold text-sm flex items-center justify-center transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Version Selection Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-zinc-50 border border-zinc-200 p-4 rounded-2xl">
          <div>
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1.5">
              Base Version (Version A)
            </label>
            <select
              value={versionAId}
              onChange={(e) => setVersionAId(e.target.value)}
              className="w-full bg-white border border-zinc-200 p-2.5 text-xs font-bold rounded-xl text-black shadow-2xs"
            >
              {versions.map((v) => (
                <option key={v._id} value={v._id}>
                  v{v.version} ({v.status}) — {new Date(v.createdAt).toLocaleDateString()}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1.5">
              Target Version (Version B)
            </label>
            <select
              value={versionBId}
              onChange={(e) => setVersionBId(e.target.value)}
              className="w-full bg-white border border-zinc-200 p-2.5 text-xs font-bold rounded-xl text-black shadow-2xs"
            >
              {versions.map((v) => (
                <option key={v._id} value={v._id}>
                  v{v.version} ({v.status}) — {new Date(v.createdAt).toLocaleDateString()}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Diff Result View */}
        <div className="min-h-[300px] flex flex-col gap-4">
          {versionAId === versionBId ? (
            <div className="p-12 text-center text-xs text-zinc-400 italic bg-zinc-50 rounded-2xl border border-zinc-200">
              Please select two different template versions to calculate the diff.
            </div>
          ) : isLoading ? (
            <div className="p-12 text-center text-xs text-zinc-400 italic bg-zinc-50 rounded-2xl border border-zinc-200">
              Comparing template version structures...
            </div>
          ) : error ? (
            <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-600">
              Failed to load version diff comparison.
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {/* Summary Badges */}
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-black">Diff Audit Results:</span>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  +{diffResult?.added?.length || 0} Added Tasks
                </span>
                <span className="text-[10px] font-bold text-red-800 bg-red-50 px-2.5 py-0.5 rounded-full border border-red-200">
                  -{diffResult?.removed?.length || 0} Removed Tasks
                </span>
                <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                  ~{diffResult?.modified?.length || 0} Modified Tasks
                </span>
              </div>

              {/* Added Tasks */}
              {diffResult?.added && diffResult.added.length > 0 && (
                <div className="bg-emerald-50/50 border border-emerald-200 rounded-2xl p-4 flex flex-col gap-2">
                  <h4 className="text-xs font-extrabold text-emerald-900 uppercase tracking-wider">
                    Added Tasks in Target Version
                  </h4>
                  <div className="flex flex-col gap-1.5">
                    {diffResult.added.map((item: any, idx: number) => (
                      <div key={idx} className="p-2.5 bg-white border border-emerald-200 rounded-xl text-xs flex justify-between items-center">
                        <span className="font-bold text-emerald-950">+ {item.title || item.name}</span>
                        <span className="text-[9px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">NEW</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Removed Tasks */}
              {diffResult?.removed && diffResult.removed.length > 0 && (
                <div className="bg-red-50/50 border border-red-200 rounded-2xl p-4 flex flex-col gap-2">
                  <h4 className="text-xs font-extrabold text-red-900 uppercase tracking-wider">
                    Removed Tasks in Target Version
                  </h4>
                  <div className="flex flex-col gap-1.5">
                    {diffResult.removed.map((item: any, idx: number) => (
                      <div key={idx} className="p-2.5 bg-white border border-red-200 rounded-xl text-xs flex justify-between items-center">
                        <span className="font-bold text-red-950">- {item.title || item.name}</span>
                        <span className="text-[9px] font-mono text-red-700 bg-red-50 px-2 py-0.5 rounded">REMOVED</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Unchanged / Clean match */}
              {(!diffResult?.added || diffResult.added.length === 0) &&
                (!diffResult?.removed || diffResult.removed.length === 0) &&
                (!diffResult?.modified || diffResult.modified.length === 0) && (
                  <div className="p-8 text-center text-xs text-zinc-500 bg-zinc-50 rounded-2xl border border-zinc-200">
                    Version structures are 100% identical. No task definitions or category changes detected.
                  </div>
                )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-zinc-150 pt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-zinc-200 hover:bg-zinc-300 text-zinc-700 font-bold text-xs rounded-xl transition cursor-pointer"
          >
            Close Version Diff
          </button>
        </div>
      </div>
    </div>
  );
};

export default TemplateVersionDiffModal;
