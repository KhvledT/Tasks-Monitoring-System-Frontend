import React from "react";
import { useQuery } from "@tanstack/react-query";
import { templatesApi, type TemplateMetaOptions } from "../api/templates.api";

interface DynamicSelectProps {
  category: keyof TemplateMetaOptions;
  value: string;
  onChange: (val: string) => void;
  label?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export const DynamicSelect: React.FC<DynamicSelectProps> = ({
  category,
  value,
  onChange,
  label,
  placeholder = "-- Select Option --",
  className = "",
  disabled = false,
}) => {
  const { data: metaOptions } = useQuery({
    queryKey: ["template-meta-options"],
    queryFn: () => templatesApi.getMetaOptions(),
    staleTime: 1000 * 60 * 30, // cache for 30 minutes
  });

  const options = metaOptions?.[category] || [];

  return (
    <div className="flex flex-col gap-1 w-full font-sans">
      {label && <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">{label}</label>}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`w-full bg-zinc-50 border border-zinc-200 px-3.5 py-2.5 text-xs font-semibold rounded-xl text-black focus:outline-none focus:border-[#0055d4] cursor-pointer disabled:opacity-50 ${className}`}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
};

export default DynamicSelect;
