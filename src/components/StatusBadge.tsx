"use client";

import { DocumentStatus } from "@/types";

const STATUS_CONFIG: Record<DocumentStatus, { label: string; bg: string; text: string }> = {
  not_uploaded: { label: "Not Uploaded", bg: "bg-gray-100", text: "text-gray-600" },
  defective: { label: "Defective", bg: "bg-red-100", text: "text-red-700" },
  partially_signed: { label: "Partially Signed", bg: "bg-amber-100", text: "text-amber-700" },
  approved: { label: "Approved", bg: "bg-green-100", text: "text-green-700" },
  not_applicable: { label: "N/A", bg: "bg-gray-100", text: "text-gray-500" },
  pending_approval: { label: "Pending", bg: "bg-blue-100", text: "text-blue-700" },
  deferral: { label: "Deferral", bg: "bg-orange-100", text: "text-orange-700" },
  waiver: { label: "Waiver", bg: "bg-purple-100", text: "text-purple-700" },
};

interface StatusBadgeProps {
  readonly status: DocumentStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  );
}
