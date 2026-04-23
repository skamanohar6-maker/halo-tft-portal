"use client";

import { Facility, Tranche } from "@/types";

interface FacilitySelectorProps {
  readonly facilities: readonly Facility[];
  readonly activeFacility: string;
  readonly activeTranche: string;
  readonly onFacilityChange: (id: string) => void;
  readonly onTrancheChange: (id: string) => void;
}

export default function FacilitySelector({
  facilities,
  activeFacility,
  activeTranche,
  onFacilityChange,
  onTrancheChange,
}: FacilitySelectorProps) {
  const currentFacility = facilities.find((f) => f.id === activeFacility) ?? facilities[0];
  const tranches: readonly Tranche[] = currentFacility?.tranches ?? [];

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-6">
      <div className="flex items-center gap-2">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Facility</label>
        <select
          value={activeFacility}
          onChange={(e) => onFacilityChange(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-1.5 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {facilities.map((f) => (
            <option key={f.id} value={f.id}>
              {f.name} &mdash; {f.fundName}
            </option>
          ))}
        </select>
      </div>
      <div className="flex items-center gap-2">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Tranche</label>
        <div className="flex gap-1">
          {tranches.map((t) => (
            <button
              key={t.id}
              onClick={() => onTrancheChange(t.id)}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                activeTranche === t.id
                  ? "bg-[#1e3a5f] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {t.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
