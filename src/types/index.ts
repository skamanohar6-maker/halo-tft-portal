export type FacilityType = "term_loan" | "working_capital" | "equity_investment";

export type DocumentStatus =
  | "not_uploaded"
  | "defective"
  | "partially_signed"
  | "approved"
  | "not_applicable"
  | "pending_approval"
  | "deferral"
  | "waiver";

export type PreferenceShareIssuance = "issued" | "not_issued" | "not_applicable";

export type UserRole = "analyst" | "fund_manager";

export type DefectReason =
  | "missing_signature"
  | "incorrect_entity"
  | "expired_document"
  | "incomplete_fields"
  | "wrong_format"
  | "mismatch_data"
  | "other";

export type StatusFilter = DocumentStatus | "all";

export type AIScanStatus = "idle" | "scanning" | "complete";

export interface AIScanResult {
  readonly docId: string;
  readonly classification: string;
  readonly confidence: number;
  readonly anomalies: readonly string[];
  readonly suggestedCategory: string;
}

export interface DocumentEntry {
  readonly id: string;
  readonly type: string;
  readonly fileName: string;
  readonly uploadDate: string;
  readonly status: DocumentStatus;
  readonly remarks: string;
  readonly approvalDate: string;
  readonly deferralDays: number;
  readonly disbursementDate: string;
  readonly targetDays: number;
  readonly defectReason: DefectReason | "";
  readonly notifiedAt: string;
}

export type CategoryId =
  | "transaction_documents"
  | "other_deal_documents"
  | "cp_debentures"
  | "cp_preference_shares"
  | "cs_debentures"
  | "cs_preference_shares"
  | "execution_version";

export type CategoryGroup = "pre_disbursement" | "post_disbursement";

export interface DocumentCategory {
  readonly id: CategoryId;
  readonly name: string;
  readonly shortName: string;
  readonly group: CategoryGroup;
  readonly documentTypes: readonly string[];
  readonly statusOptions: readonly DocumentStatus[];
  readonly hasDeferralDays: boolean;
  readonly hasDisbursementFields: boolean;
  readonly hasPariPassu: boolean;
  readonly isMandatoryForDisbursement: boolean;
}

export interface Tranche {
  readonly id: string;
  readonly name: string;
}

export interface Facility {
  readonly id: string;
  readonly name: string;
  readonly fundName: string;
  readonly tranches: readonly Tranche[];
}

export interface FacilityTypeConfig {
  readonly id: FacilityType;
  readonly name: string;
  readonly facilities: readonly Facility[];
}

export interface PDDEntry {
  readonly brandName: string;
  readonly legalName: string;
  readonly spocName: string;
  readonly amount: string;
  readonly facilityType: string;
  readonly tranche: string;
  readonly documentType: string;
  readonly disbursementDate: string;
  readonly targetDate: string;
  readonly delayDays: number;
  readonly closureDate: string;
  readonly status: DocumentStatus;
  readonly remarks: string;
}

export const DEFECT_REASON_LABELS: Record<DefectReason, string> = {
  missing_signature: "Missing Signature",
  incorrect_entity: "Incorrect Entity Name",
  expired_document: "Expired Document",
  incomplete_fields: "Incomplete Fields",
  wrong_format: "Wrong Format",
  mismatch_data: "Data Mismatch",
  other: "Other",
};
