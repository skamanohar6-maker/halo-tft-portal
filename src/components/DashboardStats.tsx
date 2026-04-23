"use client";

import { StatusFilter } from "@/types";

interface StatsProps {
  readonly totalDocuments: number;
  readonly approved: number;
  readonly pending: number;
  readonly defective: number;
  readonly notUploaded: number;
  readonly activeFilter: StatusFilter;
  readonly onFilterChange: (filter: StatusFilter) => void;
}

function ProgressRing({ percent, color, size = 48 }: { readonly percent: number; readonly color: string; readonly size?: number }) {
  const strokeWidth = 4;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        className="text-gray-100"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        className="transition-all duration-700 ease-out"
      />
    </svg>
  );
}

interface CardConfig {
  readonly key: StatusFilter;
  readonly label: string;
  readonly value: number;
  readonly borderColor: string;
  readonly ringColor: string;
  readonly labelColor: string;
  readonly valueColor: string;
  readonly hoverBg: string;
  readonly activeBg: string;
  readonly icon: string;
}

export default function DashboardStats({
  totalDocuments,
  approved,
  pending,
  defective,
  notUploaded,
  activeFilter,
  onFilterChange,
}: StatsProps) {
  const pct = totalDocuments > 0 ? Math.round((approved / totalDocuments) * 100) : 0;

  const cards: readonly CardConfig[] = [
    {
      key: "all",
      label: "Total Documents",
      value: totalDocuments,
      borderColor: "border-gray-200",
      ringColor: "#6366f1",
      labelColor: "text-gray-500",
      valueColor: "text-gray-900",
      hoverBg: "hover:bg-gray-50",
      activeBg: "bg-indigo-50 border-indigo-300 ring-2 ring-indigo-200",
      icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
    },
    {
      key: "approved",
      label: "Approved",
      value: approved,
      borderColor: "border-green-200",
      ringColor: "#16a34a",
      labelColor: "text-green-600",
      valueColor: "text-green-700",
      hoverBg: "hover:bg-green-50",
      activeBg: "bg-green-50 border-green-400 ring-2 ring-green-200",
      icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
    },
    {
      key: "pending_approval",
      label: "Pending Approval",
      value: pending,
      borderColor: "border-blue-200",
      ringColor: "#2563eb",
      labelColor: "text-blue-600",
      valueColor: "text-blue-700",
      hoverBg: "hover:bg-blue-50",
      activeBg: "bg-blue-50 border-blue-400 ring-2 ring-blue-200",
      icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
    },
    {
      key: "defective",
      label: "Defective",
      value: defective,
      borderColor: "border-red-200",
      ringColor: "#dc2626",
      labelColor: "text-red-600",
      valueColor: "text-red-700",
      hoverBg: "hover:bg-red-50",
      activeBg: "bg-red-50 border-red-400 ring-2 ring-red-200",
      icon: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z",
    },
    {
      key: "not_uploaded",
      label: "Not Uploaded",
      value: notUploaded,
      borderColor: "border-gray-200",
      ringColor: "#9ca3af",
      labelColor: "text-gray-500",
      valueColor: "text-gray-700",
      hoverBg: "hover:bg-gray-50",
      activeBg: "bg-gray-100 border-gray-400 ring-2 ring-gray-200",
      icon: "M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 px-6 py-4">
      {cards.map((card) => {
        const isActive = activeFilter === card.key;
        const cardPct = totalDocuments > 0 ? Math.round((card.value / totalDocuments) * 100) : 0;

        return (
          <button
            key={card.key}
            onClick={() => onFilterChange(isActive ? "all" : card.key)}
            className={`relative rounded-xl border p-4 shadow-sm transition-all cursor-pointer text-left ${
              isActive
                ? card.activeBg
                : `bg-white ${card.borderColor} ${card.hoverBg}`
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-1.5">
                  <svg className={`w-3.5 h-3.5 ${card.labelColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={card.icon} />
                  </svg>
                  <p className={`text-xs font-semibold uppercase tracking-wider ${card.labelColor}`}>
                    {card.label}
                  </p>
                </div>
                <p className={`text-2xl font-bold mt-1.5 ${card.valueColor}`}>{card.value}</p>
              </div>
              <div className="relative flex items-center justify-center">
                <ProgressRing percent={card.key === "all" ? pct : cardPct} color={card.ringColor} />
                <span className="absolute text-[10px] font-bold text-gray-500">
                  {card.key === "all" ? pct : cardPct}%
                </span>
              </div>
            </div>
            {isActive && (
              <div className="mt-2 text-[10px] font-medium text-gray-500 flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Filtering active — click to clear
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
