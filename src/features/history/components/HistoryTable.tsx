import React from "react";
import type { HistoryItem } from "../types/history.types";
import { HistoryStatusBadge } from "./HistoryStatusBadge";
import { formatDateTime } from "../../../shared/utils/date";
import { Card } from "@heroui/react";

interface HistoryTableProps {
  items: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const HistoryTable: React.FC<HistoryTableProps> = ({
  items,
  onSelect,
  page,
  totalPages,
  onPageChange,
}) => {
  return (
    <div className="flex flex-col gap-4 w-full">
      <Card className="border border-zinc-900 bg-zinc-950/40 rounded-2xl overflow-hidden shadow-md">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-zinc-900/60 text-left">
            <thead className="bg-zinc-950/80 font-sans">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-zinc-400 tracking-wider">
                  Date / Time (UTC)
                </th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-400 tracking-wider">
                  Category
                </th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-400 tracking-wider">
                  Task Title
                </th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-400 tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-400 tracking-wider">
                  Completed By
                </th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-400 tracking-wider text-right">
                  Details
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900/40 bg-transparent text-xs font-medium text-zinc-300">
              {items.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-zinc-900/20 transition duration-150 group"
                >
                  <td className="px-6 py-4 whitespace-nowrap font-mono text-[11px] text-zinc-400">
                    {formatDateTime(item.issueDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-zinc-400 truncate max-w-[150px]">
                    {item.categoryName}
                  </td>
                  <td className="px-6 py-4 font-bold text-zinc-200 truncate max-w-[200px]">
                    {item.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <HistoryStatusBadge status={item.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="font-semibold text-zinc-200">
                        {item.completedBy.fullName}
                      </span>
                      <span className="text-[10px] text-zinc-500 font-medium">
                        {item.completedBy.rank}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button
                      onClick={() => onSelect(item)}
                      type="button"
                      className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-400 group-hover:text-sky-400 text-xs font-semibold rounded-lg transition active:scale-[0.98] cursor-pointer"
                    >
                      View Logs
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-2 px-1">
          <span className="text-[11px] text-zinc-500 font-bold">
            Page {page} of {totalPages}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
              type="button"
              className="px-3.5 py-2 bg-zinc-950 border border-zinc-900 hover:bg-zinc-900 text-zinc-400 disabled:opacity-40 text-xs font-semibold rounded-xl transition cursor-pointer"
            >
              Previous
            </button>
            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages}
              type="button"
              className="px-3.5 py-2 bg-zinc-950 border border-zinc-900 hover:bg-zinc-900 text-zinc-400 disabled:opacity-40 text-xs font-semibold rounded-xl transition cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryTable;
