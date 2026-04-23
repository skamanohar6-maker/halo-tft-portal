"use client";

import { CategoryId, DocumentCategory } from "@/types";

interface CategoryTabsProps {
  readonly categories: readonly DocumentCategory[];
  readonly activeCategory: CategoryId;
  readonly onCategoryChange: (id: CategoryId) => void;
  readonly completionCounts: Record<CategoryId, { total: number; approved: number }>;
}

export default function CategoryTabs({
  categories,
  activeCategory,
  onCategoryChange,
  completionCounts,
}: CategoryTabsProps) {
  const cpCats = categories.filter((c) => c.group === "pre_disbursement");
  const csCats = categories.filter((c) => c.group === "post_disbursement");

  function renderTab(cat: DocumentCategory) {
    const counts = completionCounts[cat.id];
    const pct = counts.total > 0 ? Math.round((counts.approved / counts.total) * 100) : 0;
    const isActive = activeCategory === cat.id;

    return (
      <button
        key={cat.id}
        onClick={() => onCategoryChange(cat.id)}
        className={`flex-shrink-0 px-4 py-2.5 text-sm rounded-lg transition-all flex flex-col gap-1.5 min-w-[120px] ${
          isActive
            ? "bg-[#1e3a5f] text-white shadow-md"
            : "text-gray-600 hover:bg-gray-100 bg-white border border-gray-200"
        }`}
      >
        <div className="flex items-center justify-between w-full">
          <span className="font-medium text-xs">{cat.shortName}</span>
          <span
            className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${
              isActive
                ? pct === 100 ? "bg-green-400 text-green-900" : "bg-white/20 text-white"
                : pct === 100 ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
            }`}
          >
            {counts.approved}/{counts.total}
          </span>
        </div>
        <div className="w-full h-1.5 bg-black/10 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isActive
                ? pct === 100 ? "bg-green-400" : "bg-white/60"
                : pct === 100 ? "bg-green-500" : "bg-blue-400"
            }`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </button>
    );
  }

  return (
    <div className="bg-gray-50 border-b border-gray-200 px-6 py-3">
      {/* CP Section */}
      <div className="mb-3">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
            CP — Pre-Disbursement
          </span>
          <div className="flex-1 h-px bg-amber-200" />
        </div>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {cpCats.map(renderTab)}
        </div>
      </div>

      {/* CS Section */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
            CS — Post-Disbursement
          </span>
          <div className="flex-1 h-px bg-indigo-200" />
        </div>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {csCats.map(renderTab)}
        </div>
      </div>
    </div>
  );
}
