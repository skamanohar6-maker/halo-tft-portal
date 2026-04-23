"use client";

import { useState, useCallback } from "react";
import { AIScanResult, AIScanStatus } from "@/types";

interface BulkUploadZoneProps {
  readonly onFilesProcessed: (results: readonly AIScanResult[]) => void;
}

const SIMULATED_CLASSIFICATIONS = [
  "Board Resolution",
  "Trust Deed",
  "KYC Document",
  "Valuation Report",
  "Guarantee Agreement",
  "NACH Mandate",
  "Power of Attorney",
  "CAM",
  "IC Minutes",
  "Allotment Letter",
] as const;

const SIMULATED_CATEGORIES = [
  "Transaction Documents",
  "Other Deal Documents",
  "CP Debentures",
  "Execution Version",
  "CS Debentures",
] as const;

const ANOMALY_POOL = [
  "Missing signature on page 3",
  "Entity name mismatch: 'ABC Ltd' vs 'ABC Pvt Ltd'",
  "Document date expired (>90 days)",
  "Stamp duty not affixed",
  "Director name not matching KYC records",
  "Amount mismatch with term sheet",
] as const;

function simulateAIScan(fileCount: number): readonly AIScanResult[] {
  return Array.from({ length: fileCount }, (_, i) => {
    const confidence = 0.72 + Math.random() * 0.27;
    const hasAnomaly = Math.random() > 0.6;
    const anomalyCount = hasAnomaly ? Math.floor(Math.random() * 2) + 1 : 0;

    const pickedAnomalies: string[] = [];
    for (let a = 0; a < anomalyCount; a++) {
      const anomaly = ANOMALY_POOL[Math.floor(Math.random() * ANOMALY_POOL.length)];
      if (!pickedAnomalies.includes(anomaly)) {
        pickedAnomalies.push(anomaly);
      }
    }

    return {
      docId: `ai_${Date.now()}_${i}`,
      classification: SIMULATED_CLASSIFICATIONS[Math.floor(Math.random() * SIMULATED_CLASSIFICATIONS.length)],
      confidence: Math.round(confidence * 100) / 100,
      anomalies: pickedAnomalies,
      suggestedCategory: SIMULATED_CATEGORIES[Math.floor(Math.random() * SIMULATED_CATEGORIES.length)],
    };
  });
}

export default function BulkUploadZone({ onFilesProcessed }: BulkUploadZoneProps) {
  const [dragOver, setDragOver] = useState(false);
  const [scanStatus, setScanStatus] = useState<AIScanStatus>("idle");
  const [results, setResults] = useState<readonly AIScanResult[]>([]);
  const [fileCount, setFileCount] = useState(0);

  const processFiles = useCallback((count: number) => {
    setFileCount(count);
    setScanStatus("scanning");
    setResults([]);

    setTimeout(() => {
      const scanResults = simulateAIScan(count);
      setResults(scanResults);
      setScanStatus("complete");
      onFilesProcessed(scanResults);
    }, 1500 + count * 300);
  }, [onFilesProcessed]);

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(true);
  }

  function handleDragLeave() {
    setDragOver(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const count = e.dataTransfer.files.length || 3;
    processFiles(count);
  }

  function handleClick() {
    const count = Math.floor(Math.random() * 4) + 2;
    processFiles(count);
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-5 py-3 border-b border-gray-100 flex items-center gap-2">
        <svg className="w-4 h-4 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        <h3 className="text-sm font-semibold text-gray-900">AI Document Scanner</h3>
        <span className="text-[10px] bg-violet-100 text-violet-700 px-1.5 py-0.5 rounded-full font-medium">Beta</span>
      </div>

      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        className={`mx-5 my-4 border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
          dragOver
            ? "border-violet-400 bg-violet-50"
            : "border-gray-300 hover:border-violet-300 hover:bg-gray-50"
        }`}
      >
        {scanStatus === "idle" && (
          <>
            <svg className="w-10 h-10 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="text-sm font-medium text-gray-600">Drop PDF files here for AI classification</p>
            <p className="text-xs text-gray-400 mt-1">Or click to simulate a bulk upload</p>
          </>
        )}

        {scanStatus === "scanning" && (
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-3 border-violet-500 border-t-transparent rounded-full animate-spin" />
            <div>
              <p className="text-sm font-medium text-violet-700">Scanning {fileCount} documents...</p>
              <p className="text-xs text-gray-400 mt-1">AI is classifying and checking for anomalies</p>
            </div>
          </div>
        )}

        {scanStatus === "complete" && (
          <div className="flex flex-col items-center gap-2">
            <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm font-medium text-green-700">{fileCount} files processed</p>
            <p className="text-xs text-gray-400">Click to scan more</p>
          </div>
        )}
      </div>

      {/* Results */}
      {results.length > 0 && (
        <div className="px-5 pb-4">
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-3 py-2 text-left font-semibold text-gray-600">Classification</th>
                  <th className="px-3 py-2 text-left font-semibold text-gray-600">Suggested Category</th>
                  <th className="px-3 py-2 text-left font-semibold text-gray-600">Confidence</th>
                  <th className="px-3 py-2 text-left font-semibold text-gray-600">Anomalies</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {results.map((r) => (
                  <tr key={r.docId} className={r.anomalies.length > 0 ? "bg-red-50/50" : ""}>
                    <td className="px-3 py-2 font-medium text-gray-900">{r.classification}</td>
                    <td className="px-3 py-2 text-gray-600">{r.suggestedCategory}</td>
                    <td className="px-3 py-2">
                      <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-semibold ${
                        r.confidence >= 0.9
                          ? "bg-green-100 text-green-700"
                          : r.confidence >= 0.8
                            ? "bg-blue-100 text-blue-700"
                            : "bg-amber-100 text-amber-700"
                      }`}>
                        {Math.round(r.confidence * 100)}%
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      {r.anomalies.length > 0 ? (
                        <div className="space-y-0.5">
                          {r.anomalies.map((a, i) => (
                            <div key={i} className="flex items-start gap-1">
                              <svg className="w-3 h-3 text-red-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                              <span className="text-red-700">{a}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-green-600 font-medium">Clean</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
