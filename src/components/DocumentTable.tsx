"use client";

import { useState } from "react";
import { DocumentEntry, DocumentStatus, DocumentCategory, UserRole, DefectReason, StatusFilter } from "@/types";
import StatusBadge from "./StatusBadge";
import DefectResolutionPanel from "./DefectResolutionPanel";

interface DocumentTableProps {
  readonly category: DocumentCategory;
  readonly documents: readonly DocumentEntry[];
  readonly userRole: UserRole;
  readonly statusFilter: StatusFilter;
  readonly onStatusChange: (docId: string, status: DocumentStatus) => void;
  readonly onRemarksChange: (docId: string, remarks: string) => void;
  readonly onUpload: (docId: string, fileName: string) => void;
  readonly onAddDocument: (docType: string) => void;
  readonly onRemoveDocument: (docId: string) => void;
  readonly onFieldChange: (docId: string, field: keyof DocumentEntry, value: string | number) => void;
  readonly onDefectReasonChange: (docId: string, reason: DefectReason) => void;
  readonly onNotify: (docId: string) => void;
  readonly onResolve: (docId: string) => void;
}

const STATUS_LABEL_MAP: Record<DocumentStatus, string> = {
  not_uploaded: "Not Uploaded",
  defective: "Defective",
  partially_signed: "Partially Signed",
  approved: "Approved",
  not_applicable: "Not Applicable",
  pending_approval: "Pending for Approval",
  deferral: "Deferral",
  waiver: "Waiver",
};

export default function DocumentTable({
  category,
  documents,
  userRole,
  statusFilter,
  onStatusChange,
  onRemarksChange,
  onUpload,
  onAddDocument,
  onRemoveDocument,
  onFieldChange,
  onDefectReasonChange,
  onNotify,
  onResolve,
}: DocumentTableProps) {
  const [addingType, setAddingType] = useState("");
  const [dragOverRow, setDragOverRow] = useState<string | null>(null);

  const filteredDocs = statusFilter === "all"
    ? documents
    : documents.filter((d) => {
        if (statusFilter === "defective") return d.status === "defective" || d.status === "partially_signed";
        return d.status === statusFilter;
      });

  function handleRowDrop(e: React.DragEvent, docId: string) {
    e.preventDefault();
    setDragOverRow(null);
    const name = `DOC_${Date.now().toString(36).toUpperCase()}.pdf`;
    onUpload(docId, name);
  }

  function handleUploadClick(docId: string) {
    const name = `DOC_${Date.now().toString(36).toUpperCase()}.pdf`;
    onUpload(docId, name);
  }

  function handleAddNew() {
    if (addingType.trim()) {
      onAddDocument(addingType.trim());
      setAddingType("");
    }
  }

  function computeOverdueDays(doc: DocumentEntry): number {
    if (!doc.disbursementDate || !doc.targetDays) return 0;
    const disbDate = new Date(doc.disbursementDate);
    const targetDate = new Date(disbDate.getTime() + doc.targetDays * 86400000);
    const today = new Date();
    const diff = Math.ceil((today.getTime() - targetDate.getTime()) / 86400000);
    return Math.max(0, diff);
  }

  const approvedCount = documents.filter((d) => d.status === "approved").length;
  const pendingCount = documents.filter((d) => d.status === "pending_approval").length;
  const defectiveCount = documents.filter((d) => d.status === "defective" || d.status === "not_uploaded").length;

  const isFundManager = userRole === "fund_manager";

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
            {category.group === "pre_disbursement" && (
              <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-semibold uppercase">
                {category.isMandatoryForDisbursement ? "Mandatory" : "Optional"}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-0.5">
            {approvedCount} of {documents.length} approved
            {statusFilter !== "all" && (
              <span className="ml-2 text-xs text-indigo-600 font-medium">
                (showing {filteredDocs.length} filtered)
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
            <span className="text-gray-600 font-medium">{approvedCount}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span className="text-gray-600 font-medium">{pendingCount}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
            <span className="text-gray-600 font-medium">{defectiveCount}</span>
          </div>
        </div>
      </div>

      {/* Fund Manager: Approval Queue banner */}
      {isFundManager && pendingCount > 0 && (
        <div className="px-6 py-2 bg-blue-50 border-b border-blue-100 flex items-center gap-2">
          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <span className="text-xs font-semibold text-blue-700">{pendingCount} documents pending your approval</span>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-left">
              <th className="px-4 py-3 font-semibold text-gray-600 w-8">#</th>
              <th className="px-4 py-3 font-semibold text-gray-600 min-w-[250px]">Document Type</th>
              <th className="px-4 py-3 font-semibold text-gray-600 w-36">Upload</th>
              <th className="px-4 py-3 font-semibold text-gray-600 w-28">Upload Date</th>
              <th className="px-4 py-3 font-semibold text-gray-600 w-40">Status</th>
              <th className="px-4 py-3 font-semibold text-gray-600 min-w-[180px]">Remarks</th>
              <th className="px-4 py-3 font-semibold text-gray-600 w-28">Approval Date</th>
              {category.hasDeferralDays && (
                <th className="px-4 py-3 font-semibold text-gray-600 w-28">Deferral Days</th>
              )}
              {category.hasDisbursementFields && (
                <>
                  <th className="px-4 py-3 font-semibold text-gray-600 w-32">Disbursement</th>
                  <th className="px-4 py-3 font-semibold text-gray-600 w-28">Target Days</th>
                  <th className="px-4 py-3 font-semibold text-gray-600 w-28">Overdue</th>
                </>
              )}
              <th className="px-4 py-3 font-semibold text-gray-600 w-24">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredDocs.map((doc, idx) => {
              const overdue = category.hasDisbursementFields ? computeOverdueDays(doc) : 0;
              const isDefective = doc.status === "defective";
              const isPending = doc.status === "pending_approval";
              const isRowDragTarget = dragOverRow === doc.id;

              return (
                <tr
                  key={doc.id}
                  onDragOver={(e) => { e.preventDefault(); setDragOverRow(doc.id); }}
                  onDragLeave={() => setDragOverRow(null)}
                  onDrop={(e) => handleRowDrop(e, doc.id)}
                  className={`transition-colors ${
                    isRowDragTarget
                      ? "bg-violet-50 ring-1 ring-inset ring-violet-300"
                      : isDefective
                        ? "bg-red-50/30 hover:bg-red-50/60"
                        : isFundManager && isPending
                          ? "bg-blue-50/30 hover:bg-blue-50/60"
                          : "hover:bg-gray-50"
                  }`}
                >
                  <td className="px-4 py-3 text-gray-400">{idx + 1}</td>
                  <td className="px-4 py-3">
                    <span className="font-medium text-gray-900">{doc.type}</span>
                    {isDefective && (
                      <DefectResolutionPanel
                        document={doc}
                        onReasonChange={onDefectReasonChange}
                        onNotify={onNotify}
                        onResolve={onResolve}
                      />
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {doc.fileName ? (
                      <div className="flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-green-700 text-xs font-medium truncate max-w-[100px]" title={doc.fileName}>
                          {doc.fileName}
                        </span>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleUploadClick(doc.id)}
                        className="text-blue-600 hover:text-blue-800 text-xs font-medium border border-blue-200 px-2.5 py-1 rounded-md hover:bg-blue-50 transition-colors flex items-center gap-1"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        Upload
                      </button>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{doc.uploadDate || "\u2014"}</td>
                  <td className="px-4 py-3">
                    {isFundManager && isPending ? (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => onStatusChange(doc.id, "approved")}
                          className="px-2 py-1 text-[10px] font-semibold bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => onStatusChange(doc.id, "defective")}
                          className="px-2 py-1 text-[10px] font-semibold bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <select
                        value={doc.status}
                        onChange={(e) => onStatusChange(doc.id, e.target.value as DocumentStatus)}
                        className={`text-xs border rounded-md px-2 py-1 bg-white focus:ring-2 focus:ring-blue-500 ${
                          isDefective ? "border-red-300 text-red-700" : "border-gray-200"
                        }`}
                      >
                        {category.statusOptions.map((s) => (
                          <option key={s} value={s}>{STATUS_LABEL_MAP[s]}</option>
                        ))}
                      </select>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="text"
                      value={doc.remarks}
                      onChange={(e) => onRemarksChange(doc.id, e.target.value)}
                      placeholder="Add remarks..."
                      className="w-full text-xs border border-gray-200 rounded-md px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">
                    {doc.status === "approved" ? (
                      <StatusBadge status="approved" />
                    ) : (
                      <span>{doc.approvalDate || "\u2014"}</span>
                    )}
                  </td>
                  {category.hasDeferralDays && (
                    <td className="px-4 py-3">
                      {doc.status === "deferral" ? (
                        <input
                          type="number"
                          value={doc.deferralDays || ""}
                          onChange={(e) => onFieldChange(doc.id, "deferralDays", parseInt(e.target.value) || 0)}
                          className="w-16 text-xs border border-gray-200 rounded-md px-2 py-1 focus:ring-2 focus:ring-blue-500"
                          placeholder="0"
                        />
                      ) : (
                        <span className="text-xs text-gray-400">{"\u2014"}</span>
                      )}
                    </td>
                  )}
                  {category.hasDisbursementFields && (
                    <>
                      <td className="px-4 py-3">
                        <input
                          type="date"
                          value={doc.disbursementDate}
                          onChange={(e) => onFieldChange(doc.id, "disbursementDate", e.target.value)}
                          className="text-xs border border-gray-200 rounded-md px-2 py-1 focus:ring-2 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          value={doc.targetDays || ""}
                          onChange={(e) => onFieldChange(doc.id, "targetDays", parseInt(e.target.value) || 0)}
                          className="w-16 text-xs border border-gray-200 rounded-md px-2 py-1 focus:ring-2 focus:ring-blue-500"
                          placeholder="0"
                        />
                      </td>
                      <td className="px-4 py-3">
                        {overdue > 0 ? (
                          <span className="text-xs font-semibold text-red-600 bg-red-50 px-1.5 py-0.5 rounded">
                            {overdue}d overdue
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400">{"\u2014"}</span>
                        )}
                      </td>
                    </>
                  )}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      {doc.fileName && (
                        <button title="Download" className="text-gray-400 hover:text-blue-600 transition-colors p-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                        </button>
                      )}
                      <button
                        onClick={() => onRemoveDocument(doc.id)}
                        title="Delete"
                        className="text-gray-400 hover:text-red-600 transition-colors p-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filteredDocs.length === 0 && (
          <div className="py-8 text-center text-gray-400 text-sm">
            No documents match the active filter.
          </div>
        )}
      </div>

      {/* Add Document */}
      <div className="px-6 py-3 border-t border-gray-100 flex items-center gap-2">
        <input
          type="text"
          value={addingType}
          onChange={(e) => setAddingType(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAddNew()}
          placeholder="Add additional document..."
          className="flex-1 text-sm border border-gray-200 rounded-md px-3 py-1.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <button
          onClick={handleAddNew}
          disabled={!addingType.trim()}
          className="px-4 py-1.5 text-sm bg-[#1e3a5f] text-white rounded-md hover:bg-[#2a4a70] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          + Add
        </button>
      </div>
    </div>
  );
}
