"use client";

import { useState } from "react";
import { DocumentEntry, DefectReason, DEFECT_REASON_LABELS } from "@/types";

interface DefectResolutionPanelProps {
  readonly document: DocumentEntry;
  readonly onReasonChange: (docId: string, reason: DefectReason) => void;
  readonly onNotify: (docId: string) => void;
  readonly onResolve: (docId: string) => void;
}

const REASON_OPTIONS: readonly DefectReason[] = [
  "missing_signature",
  "incorrect_entity",
  "expired_document",
  "incomplete_fields",
  "wrong_format",
  "mismatch_data",
  "other",
];

export default function DefectResolutionPanel({
  document: doc,
  onReasonChange,
  onNotify,
  onResolve,
}: DefectResolutionPanelProps) {
  const [expanded, setExpanded] = useState(false);

  if (doc.status !== "defective") return null;

  return (
    <div className="mt-1">
      <button
        onClick={() => setExpanded(!expanded)}
        className="text-[10px] text-red-600 hover:text-red-800 font-medium flex items-center gap-1"
      >
        <svg className={`w-3 h-3 transition-transform ${expanded ? "rotate-90" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        Resolve defect
      </button>

      {expanded && (
        <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg space-y-2">
          {/* Reason Tags */}
          <div>
            <p className="text-[10px] font-semibold text-red-700 mb-1.5">Defect Reason:</p>
            <div className="flex flex-wrap gap-1">
              {REASON_OPTIONS.map((reason) => (
                <button
                  key={reason}
                  onClick={() => onReasonChange(doc.id, reason)}
                  className={`px-2 py-0.5 text-[10px] rounded-full border transition-colors ${
                    doc.defectReason === reason
                      ? "bg-red-600 text-white border-red-600"
                      : "bg-white text-red-700 border-red-300 hover:bg-red-100"
                  }`}
                >
                  {DEFECT_REASON_LABELS[reason]}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => onNotify(doc.id)}
              disabled={!!doc.notifiedAt}
              className={`flex items-center gap-1 px-2.5 py-1 text-[10px] font-medium rounded-md transition-colors ${
                doc.notifiedAt
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-amber-500 text-white hover:bg-amber-600"
              }`}
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {doc.notifiedAt ? "Notified" : "Notify Party"}
            </button>
            <button
              onClick={() => onResolve(doc.id)}
              className="flex items-center gap-1 px-2.5 py-1 text-[10px] font-medium rounded-md bg-green-600 text-white hover:bg-green-700 transition-colors"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Mark Resolved
            </button>
            {doc.notifiedAt && (
              <span className="text-[9px] text-gray-400">
                Sent {new Date(doc.notifiedAt).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
