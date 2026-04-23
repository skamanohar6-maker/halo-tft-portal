"use client";

import { DocumentEntry, CategoryId } from "@/types";
import StatusBadge from "./StatusBadge";

interface PDDData {
  readonly facilityType: string;
  readonly facilityName: string;
  readonly trancheName: string;
  readonly categoryName: string;
  readonly documents: readonly DocumentEntry[];
}

interface PDDListProps {
  readonly entries: readonly PDDData[];
}

export default function PDDList({ entries }: PDDListProps) {
  const allDocs = entries.flatMap((e) =>
    e.documents
      .filter((d) => d.status !== "not_uploaded" && d.status !== "not_applicable")
      .map((d) => ({
        ...d,
        facilityType: e.facilityType,
        facilityName: e.facilityName,
        trancheName: e.trancheName,
        categoryName: e.categoryName,
      }))
  );

  if (allDocs.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p className="text-gray-500 text-sm">No documents tracked yet. Upload documents in the category tabs to see them here.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Auto-Generated PDD List</h3>
        <p className="text-sm text-gray-500 mt-0.5">{allDocs.length} documents tracked</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-left">
              <th className="px-4 py-3 font-semibold text-gray-600">#</th>
              <th className="px-4 py-3 font-semibold text-gray-600">Facility Type</th>
              <th className="px-4 py-3 font-semibold text-gray-600">Facility</th>
              <th className="px-4 py-3 font-semibold text-gray-600">Tranche</th>
              <th className="px-4 py-3 font-semibold text-gray-600">Category</th>
              <th className="px-4 py-3 font-semibold text-gray-600">Document Type</th>
              <th className="px-4 py-3 font-semibold text-gray-600">Upload Date</th>
              <th className="px-4 py-3 font-semibold text-gray-600">Status</th>
              <th className="px-4 py-3 font-semibold text-gray-600">Remarks</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {allDocs.map((doc, idx) => (
              <tr key={`${doc.id}_${idx}`} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-400">{idx + 1}</td>
                <td className="px-4 py-3 font-medium text-gray-700">{doc.facilityType}</td>
                <td className="px-4 py-3 text-gray-600">{doc.facilityName}</td>
                <td className="px-4 py-3 text-gray-600">{doc.trancheName}</td>
                <td className="px-4 py-3 text-gray-600">{doc.categoryName}</td>
                <td className="px-4 py-3 font-medium text-gray-900">{doc.type}</td>
                <td className="px-4 py-3 text-gray-500">{doc.uploadDate || "\u2014"}</td>
                <td className="px-4 py-3"><StatusBadge status={doc.status} /></td>
                <td className="px-4 py-3 text-gray-500 max-w-[200px] truncate">{doc.remarks || "\u2014"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
