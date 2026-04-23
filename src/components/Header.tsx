"use client";

import { FacilityType, UserRole } from "@/types";
import { FACILITY_TYPES } from "@/data/facilities";

interface HeaderProps {
  readonly activeFacilityType: FacilityType;
  readonly onFacilityTypeChange: (ft: FacilityType) => void;
  readonly userRole: UserRole;
  readonly onRoleChange: (role: UserRole) => void;
}

export default function Header({ activeFacilityType, onFacilityTypeChange, userRole, onRoleChange }: HeaderProps) {
  return (
    <header className="bg-[#1e3a5f] text-white shadow-lg">
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-400 rounded-lg flex items-center justify-center font-bold text-[#1e3a5f] text-lg">
            H
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">HALO</h1>
            <p className="text-xs text-blue-200">TFT Document Tracker</p>
          </div>
        </div>

        {/* Role Switcher */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white/10 rounded-lg p-0.5">
            <button
              onClick={() => onRoleChange("analyst")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                userRole === "analyst"
                  ? "bg-white text-[#1e3a5f] shadow-sm"
                  : "text-blue-200 hover:text-white"
              }`}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              Analyst
            </button>
            <button
              onClick={() => onRoleChange("fund_manager")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                userRole === "fund_manager"
                  ? "bg-white text-[#1e3a5f] shadow-sm"
                  : "text-blue-200 hover:text-white"
              }`}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Fund Manager
            </button>
          </div>
        </div>
      </div>
      <nav className="px-6 flex gap-1">
        {FACILITY_TYPES.map((ft) => (
          <button
            key={ft.id}
            onClick={() => onFacilityTypeChange(ft.id)}
            className={`px-5 py-2.5 text-sm font-medium rounded-t-lg transition-colors ${
              activeFacilityType === ft.id
                ? "bg-white text-[#1e3a5f]"
                : "text-blue-200 hover:bg-white/10"
            }`}
          >
            {ft.name}
          </button>
        ))}
      </nav>
    </header>
  );
}
