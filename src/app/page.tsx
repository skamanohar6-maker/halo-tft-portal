"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import {
  FacilityType,
  CategoryId,
  DocumentEntry,
  DocumentStatus,
  UserRole,
  DefectReason,
  StatusFilter,
  AIScanResult,
} from "@/types";
import { FACILITY_TYPES } from "@/data/facilities";
import { CATEGORIES } from "@/data/categories";
import {
  loadDocuments,
  saveDocuments,
  updateDocumentStatus,
  updateDocumentField,
  addDocument,
  removeDocument,
  simulateUpload,
  setDefectReason,
  markNotified,
  loadUserRole,
  saveUserRole,
} from "@/data/store";
import Header from "@/components/Header";
import FacilitySelector from "@/components/FacilitySelector";
import CategoryTabs from "@/components/CategoryTabs";
import DocumentTable from "@/components/DocumentTable";
import DashboardStats from "@/components/DashboardStats";
import PDDList from "@/components/PDDList";
import DisbursementReadiness from "@/components/DisbursementReadiness";
import BulkUploadZone from "@/components/BulkUploadZone";

type ViewMode = "documents" | "pdd" | "ai_scanner";

export default function Home() {
  const [facilityType, setFacilityType] = useState<FacilityType>("term_loan");
  const [facilityId, setFacilityId] = useState("tl_f1");
  const [trancheId, setTrancheId] = useState("tl_f1_t1");
  const [activeCategory, setActiveCategory] = useState<CategoryId>("transaction_documents");
  const [viewMode, setViewMode] = useState<ViewMode>("documents");
  const [documents, setDocuments] = useState<Record<CategoryId, DocumentEntry[]>>({} as Record<CategoryId, DocumentEntry[]>);
  const [mounted, setMounted] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>("analyst");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const currentFacilityType = FACILITY_TYPES.find((ft) => ft.id === facilityType)!;
  const currentFacility = currentFacilityType.facilities.find((f) => f.id === facilityId) ?? currentFacilityType.facilities[0];
  const currentCategory = CATEGORIES.find((c) => c.id === activeCategory)!;

  // Load on mount
  useEffect(() => {
    const loaded: Record<string, DocumentEntry[]> = {};
    for (const cat of CATEGORIES) {
      loaded[cat.id] = loadDocuments(trancheId, cat.id, cat.documentTypes);
    }
    setDocuments(loaded as Record<CategoryId, DocumentEntry[]>);
    setUserRole(loadUserRole());
    setMounted(true);
  }, [trancheId]);

  // Persist on change
  useEffect(() => {
    if (!mounted) return;
    for (const cat of CATEGORIES) {
      const docs = documents[cat.id];
      if (docs) {
        saveDocuments(trancheId, cat.id, docs);
      }
    }
  }, [documents, trancheId, mounted]);

  const handleFacilityTypeChange = useCallback((ft: FacilityType) => {
    setFacilityType(ft);
    const newFt = FACILITY_TYPES.find((f) => f.id === ft)!;
    const firstFacility = newFt.facilities[0];
    setFacilityId(firstFacility.id);
    setTrancheId(firstFacility.tranches[0].id);
    setStatusFilter("all");
  }, []);

  const handleFacilityChange = useCallback((fId: string) => {
    setFacilityId(fId);
    const fac = currentFacilityType.facilities.find((f) => f.id === fId);
    if (fac) {
      setTrancheId(fac.tranches[0].id);
    }
  }, [currentFacilityType]);

  const handleRoleChange = useCallback((role: UserRole) => {
    setUserRole(role);
    saveUserRole(role);
    setStatusFilter("all");
  }, []);

  const handleStatusChange = useCallback((docId: string, status: DocumentStatus) => {
    setDocuments((prev) => ({
      ...prev,
      [activeCategory]: updateDocumentStatus(prev[activeCategory] ?? [], docId, status),
    }));
  }, [activeCategory]);

  const handleRemarksChange = useCallback((docId: string, remarks: string) => {
    setDocuments((prev) => ({
      ...prev,
      [activeCategory]: updateDocumentField(prev[activeCategory] ?? [], docId, "remarks", remarks),
    }));
  }, [activeCategory]);

  const handleUpload = useCallback((docId: string, fileName: string) => {
    setDocuments((prev) => ({
      ...prev,
      [activeCategory]: simulateUpload(prev[activeCategory] ?? [], docId, fileName),
    }));
  }, [activeCategory]);

  const handleAddDocument = useCallback((docType: string) => {
    setDocuments((prev) => ({
      ...prev,
      [activeCategory]: addDocument(prev[activeCategory] ?? [], docType),
    }));
  }, [activeCategory]);

  const handleRemoveDocument = useCallback((docId: string) => {
    setDocuments((prev) => ({
      ...prev,
      [activeCategory]: removeDocument(prev[activeCategory] ?? [], docId),
    }));
  }, [activeCategory]);

  const handleFieldChange = useCallback((docId: string, field: keyof DocumentEntry, value: string | number) => {
    setDocuments((prev) => ({
      ...prev,
      [activeCategory]: updateDocumentField(prev[activeCategory] ?? [], docId, field, value),
    }));
  }, [activeCategory]);

  const handleDefectReasonChange = useCallback((docId: string, reason: DefectReason) => {
    setDocuments((prev) => ({
      ...prev,
      [activeCategory]: setDefectReason(prev[activeCategory] ?? [], docId, reason),
    }));
  }, [activeCategory]);

  const handleNotify = useCallback((docId: string) => {
    setDocuments((prev) => ({
      ...prev,
      [activeCategory]: markNotified(prev[activeCategory] ?? [], docId),
    }));
  }, [activeCategory]);

  const handleResolve = useCallback((docId: string) => {
    setDocuments((prev) => ({
      ...prev,
      [activeCategory]: updateDocumentStatus(prev[activeCategory] ?? [], docId, "pending_approval"),
    }));
  }, [activeCategory]);

  const handleAIProcessed = useCallback((_results: readonly AIScanResult[]) => {
    // In a real app this would auto-classify and slot documents.
    // For now the results are displayed in the BulkUploadZone itself.
  }, []);

  const completionCounts = useMemo(() => {
    const counts = {} as Record<CategoryId, { total: number; approved: number }>;
    for (const cat of CATEGORIES) {
      const docs = documents[cat.id] ?? [];
      counts[cat.id] = {
        total: docs.length,
        approved: docs.filter((d) => d.status === "approved").length,
      };
    }
    return counts;
  }, [documents]);

  const stats = useMemo(() => {
    const allDocs = Object.values(documents).flat();
    return {
      totalDocuments: allDocs.length,
      approved: allDocs.filter((d) => d.status === "approved").length,
      pending: allDocs.filter((d) => d.status === "pending_approval").length,
      defective: allDocs.filter((d) => d.status === "defective" || d.status === "partially_signed").length,
      notUploaded: allDocs.filter((d) => d.status === "not_uploaded").length,
    };
  }, [documents]);

  const pddEntries = useMemo(() => {
    return CATEGORIES.map((cat) => ({
      facilityType: currentFacilityType.name,
      facilityName: currentFacility.name,
      trancheName: currentFacility.tranches.find((t) => t.id === trancheId)?.name ?? "",
      categoryName: cat.name,
      documents: documents[cat.id] ?? [],
    }));
  }, [documents, currentFacilityType, currentFacility, trancheId]);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-[#1e3a5f] border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-gray-400">Loading HALO...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        activeFacilityType={facilityType}
        onFacilityTypeChange={handleFacilityTypeChange}
        userRole={userRole}
        onRoleChange={handleRoleChange}
      />
      <FacilitySelector
        facilities={[...currentFacilityType.facilities]}
        activeFacility={facilityId}
        activeTranche={trancheId}
        onFacilityChange={handleFacilityChange}
        onTrancheChange={setTrancheId}
      />

      {/* Disbursement Readiness */}
      <div className="px-6 pt-4">
        <DisbursementReadiness documents={documents} categories={[...CATEGORIES]} />
      </div>

      {/* Stats with clickable filters */}
      <DashboardStats
        {...stats}
        activeFilter={statusFilter}
        onFilterChange={setStatusFilter}
      />

      {/* View Switcher */}
      <div className="px-6 pb-2 flex items-center gap-2">
        <button
          onClick={() => setViewMode("documents")}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
            viewMode === "documents"
              ? "bg-[#1e3a5f] text-white"
              : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Document Categories
        </button>
        <button
          onClick={() => setViewMode("pdd")}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
            viewMode === "pdd"
              ? "bg-[#1e3a5f] text-white"
              : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
          PDD List
        </button>
        <button
          onClick={() => setViewMode("ai_scanner")}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
            viewMode === "ai_scanner"
              ? "bg-violet-700 text-white"
              : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          AI Scanner
        </button>
      </div>

      {/* Content Views */}
      {viewMode === "documents" && (
        <>
          <CategoryTabs
            categories={[...CATEGORIES]}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
            completionCounts={completionCounts}
          />
          <div className="px-6 py-4">
            <DocumentTable
              category={currentCategory}
              documents={documents[activeCategory] ?? []}
              userRole={userRole}
              statusFilter={statusFilter}
              onStatusChange={handleStatusChange}
              onRemarksChange={handleRemarksChange}
              onUpload={handleUpload}
              onAddDocument={handleAddDocument}
              onRemoveDocument={handleRemoveDocument}
              onFieldChange={handleFieldChange}
              onDefectReasonChange={handleDefectReasonChange}
              onNotify={handleNotify}
              onResolve={handleResolve}
            />
          </div>
        </>
      )}

      {viewMode === "pdd" && (
        <div className="px-6 py-4">
          <PDDList entries={pddEntries} />
        </div>
      )}

      {viewMode === "ai_scanner" && (
        <div className="px-6 py-4">
          <BulkUploadZone onFilesProcessed={handleAIProcessed} />
        </div>
      )}
    </div>
  );
}
