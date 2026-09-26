"use client";

import {
  ArrowClockwise,
  MapPin,
  ShieldWarning,
  Spinner,
} from "@phosphor-icons/react";
import type { RiskAnalysisResult } from "@/types";

interface RiskAnalysisCardProps {
  data: RiskAnalysisResult | null;
  locationName: string | null;
  loading: boolean;
  error: string | null;
  onAnalyze: () => void;
}

export default function RiskAnalysisCard({
  data,
  locationName,
  loading,
  error,
  onAnalyze,
}: RiskAnalysisCardProps) {
  return (
    <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-red-50 p-2 text-red-600">
            <ShieldWarning size={20} weight="fill" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900">
              Analisis Risiko ML
            </h3>
            <p className="mt-0.5 flex items-center gap-1 text-xs text-gray-500">
              <MapPin size={12} /> {locationName ?? "Kota belum dipilih"}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onAnalyze}
          disabled={loading}
          className="inline-flex items-center gap-1.5 rounded-lg bg-gray-900 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-gray-800 disabled:opacity-50"
        >
          {loading ? (
            <Spinner size={14} className="animate-spin" />
          ) : (
            <ArrowClockwise size={14} />
          )}
          {data ? "Analisis Ulang" : "Cek Kerentanan"}
        </button>
      </div>

      {error && <p className="text-xs text-red-600">{error}</p>}

      {data && (
        <div className="rounded-lg border border-gray-100 bg-gray-50 p-3.5">
          <div className="mb-1 flex items-center justify-between">
            <span className="text-xs font-medium text-gray-600">
              Skor Kerentanan ML
            </span>
            <span className="text-sm font-bold text-red-600">
              {data.vulnerabilityScore} / 100 ({data.category})
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full bg-red-500 transition-all duration-500"
              style={{ width: `${data.vulnerabilityScore}%` }}
            />
          </div>
          <div className="mt-2.5 grid grid-cols-2 gap-2 text-[11px] text-gray-500">
            <div>• Frekuensi: {data.features.freqPerYear} kali/thn</div>
            <div>• Gempa &ge; M 5.0: {data.features.m5Count} kali</div>
            <div>• Magnitudo maksimum: M {data.features.maxMagnitude}</div>
            <div>• Kedalaman rata-rata: {data.features.avgDepthKm} km</div>
          </div>
        </div>
      )}
    </div>
  );
}
