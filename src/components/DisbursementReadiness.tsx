"use client";

import { DocumentEntry, CategoryId, DocumentCategory } from "@/types";

interface ReadinessProps {
  readonly documents: Record<CategoryId, DocumentEntry[]>;
  readonly categories: readonly DocumentCategory[];
}

interface CategoryReadiness {
  readonly name: string;
  readonly total: number;
  readonly approved: number;
  readonly defective: number;
  readonly pending: number;
  readonly ready: boolean;
}

export default function DisbursementReadiness({ documents, categories }: ReadinessProps) {
  const mandatoryCategories = categories.filter((c) => c.isMandatoryForDisbursement);

  const readiness: readonly CategoryReadiness[] = mandatoryCategories.map((cat) => {
    const docs = documents[cat.id] ?? [];
    const nonNA = docs.filter((d) => d.status !== "not_applicable");
    const approved = nonNA.filter((d) => d.status === "approved" || d.status === "waiver").length;
    const defective = nonNA.filter((d) => d.status === "defective" || d.status === "partially_signed").length;
    const pending = nonNA.filter((d) => d.status === "pending_approval" || d.status === "not_uploaded").length;
    const deferred = nonNA.filter((d) => d.status === "deferral").length;

    return {
      name: cat.shortName,
      total: nonNA.length,
      approved: approved + deferred,
      defective,
      pending,
      ready: pending === 0 && defective === 0 && nonNA.length > 0,
    };
  });

  const allReady = readiness.every((r) => r.ready);
  const overallApproved = readiness.reduce((s, r) => s + r.approved, 0);
  const overallTotal = readiness.reduce((s, r) => s + r.total, 0);
  const overallPct = overallTotal > 0 ? Math.round((overallApproved / overallTotal) * 100) : 0;

  return (
    <div className={`rounded-xl border-2 shadow-sm overflow-hidden transition-colors ${
      allReady ? "border-green-300 bg-green-50" : "border-amber-300 bg-amber-50"
    }`}>
      {/* Header */}
      <div className="px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            allReady ? "bg-green-500" : "bg-amber-500"
          }`}>
            {allReady ? (
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            )}
          </div>
          <div>
            <h3 className={`text-sm font-bold ${allReady ? "text-green-800" : "text-amber-800"}`}>
              Disbursement Readiness
            </h3>
            <p className={`text-xs ${allReady ? "text-green-600" : "text-amber-600"}`}>
              {allReady ? "All mandatory CPs cleared — ready for disbursement" : "Mandatory CP documents still outstanding"}
            </p>
          </div>
        </div>
        <div className="text-right">
          <span className={`text-2xl font-bold ${allReady ? "text-green-700" : "text-amber-700"}`}>
            {overallPct}%
          </span>
          <p className={`text-[10px] font-medium ${allReady ? "text-green-600" : "text-amber-600"}`}>
            {overallApproved}/{overallTotal} cleared
          </p>
        </div>
      </div>

      {/* Category breakdown */}
      <div className="px-5 pb-4 grid grid-cols-2 lg:grid-cols-4 gap-2">
        {readiness.map((r) => {
          const pct = r.total > 0 ? Math.round((r.approved / r.total) * 100) : 0;
          return (
            <div
              key={r.name}
              className={`rounded-lg px-3 py-2 ${
                r.ready
                  ? "bg-green-100/80 border border-green-200"
                  : "bg-white/80 border border-amber-200"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-gray-700">{r.name}</span>
                {r.ready ? (
                  <svg className="w-3.5 h-3.5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <span className="text-[10px] font-bold text-amber-600">{pct}%</span>
                )}
              </div>
              <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    r.ready ? "bg-green-500" : "bg-amber-400"
                  }`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              {r.defective > 0 && (
                <p className="text-[10px] text-red-600 mt-1 font-medium">{r.defective} defective</p>
              )}
              {r.pending > 0 && (
                <p className="text-[10px] text-gray-500 mt-0.5">{r.pending} pending</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
