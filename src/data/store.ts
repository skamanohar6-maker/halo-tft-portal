import { DocumentEntry, DocumentStatus, CategoryId, UserRole, DefectReason } from "@/types";

type StoreKey = `${string}_${CategoryId}`;

function buildKey(trancheId: string, categoryId: CategoryId): StoreKey {
  return `${trancheId}_${categoryId}`;
}

function createDefaultEntry(docType: string, index: number): DocumentEntry {
  return {
    id: `doc_${index}_${Date.now()}`,
    type: docType,
    fileName: "",
    uploadDate: "",
    status: "not_uploaded",
    remarks: "",
    approvalDate: "",
    deferralDays: 0,
    disbursementDate: "",
    targetDays: 0,
    defectReason: "",
    notifiedAt: "",
  };
}

export function loadDocuments(
  trancheId: string,
  categoryId: CategoryId,
  defaultTypes: readonly string[]
): DocumentEntry[] {
  if (typeof window === "undefined") return defaultTypes.map(createDefaultEntry);

  const key = buildKey(trancheId, categoryId);
  const stored = localStorage.getItem(`tft_${key}`);
  if (stored) {
    try {
      const parsed = JSON.parse(stored) as DocumentEntry[];
      return parsed.map((d) => ({
        ...createDefaultEntry(d.type, 0),
        ...d,
      }));
    } catch {
      // fall through to defaults
    }
  }
  return defaultTypes.map(createDefaultEntry);
}

export function saveDocuments(
  trancheId: string,
  categoryId: CategoryId,
  documents: readonly DocumentEntry[]
): void {
  if (typeof window === "undefined") return;
  const key = buildKey(trancheId, categoryId);
  localStorage.setItem(`tft_${key}`, JSON.stringify(documents));
}

export function updateDocumentStatus(
  docs: readonly DocumentEntry[],
  docId: string,
  status: DocumentStatus
): DocumentEntry[] {
  return docs.map((d) =>
    d.id === docId
      ? {
          ...d,
          status,
          approvalDate: status === "approved" ? new Date().toISOString().split("T")[0] : d.approvalDate,
          defectReason: status !== "defective" ? "" as const : d.defectReason,
          notifiedAt: status !== "defective" ? "" : d.notifiedAt,
        }
      : d
  );
}

export function updateDocumentField(
  docs: readonly DocumentEntry[],
  docId: string,
  field: keyof DocumentEntry,
  value: string | number
): DocumentEntry[] {
  return docs.map((d) =>
    d.id === docId ? { ...d, [field]: value } : d
  );
}

export function setDefectReason(
  docs: readonly DocumentEntry[],
  docId: string,
  reason: DefectReason
): DocumentEntry[] {
  return docs.map((d) =>
    d.id === docId ? { ...d, defectReason: reason } : d
  );
}

export function markNotified(
  docs: readonly DocumentEntry[],
  docId: string
): DocumentEntry[] {
  return docs.map((d) =>
    d.id === docId ? { ...d, notifiedAt: new Date().toISOString() } : d
  );
}

export function addDocument(
  docs: readonly DocumentEntry[],
  docType: string
): DocumentEntry[] {
  return [...docs, createDefaultEntry(docType, docs.length)];
}

export function removeDocument(
  docs: readonly DocumentEntry[],
  docId: string
): DocumentEntry[] {
  return docs.filter((d) => d.id !== docId);
}

export function simulateUpload(
  docs: readonly DocumentEntry[],
  docId: string,
  fileName: string
): DocumentEntry[] {
  return docs.map((d) =>
    d.id === docId
      ? {
          ...d,
          fileName,
          uploadDate: new Date().toISOString().split("T")[0],
        }
      : d
  );
}

export function loadUserRole(): UserRole {
  if (typeof window === "undefined") return "analyst";
  return (localStorage.getItem("tft_role") as UserRole) ?? "analyst";
}

export function saveUserRole(role: UserRole): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("tft_role", role);
}

export function loadPreferenceShareStatus(trancheId: string): string {
  if (typeof window === "undefined") return "not_applicable";
  return localStorage.getItem(`tft_pref_${trancheId}`) ?? "not_applicable";
}

export function savePreferenceShareStatus(trancheId: string, status: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(`tft_pref_${trancheId}`, status);
}

export function loadPariPassuStatus(trancheId: string): string {
  if (typeof window === "undefined") return "not_applicable";
  return localStorage.getItem(`tft_pari_${trancheId}`) ?? "not_applicable";
}

export function savePariPassuStatus(trancheId: string, status: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(`tft_pari_${trancheId}`, status);
}
