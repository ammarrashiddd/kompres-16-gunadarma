"use client";

import { useState } from "react";
import {
  ShieldWarning,
  Robot,
  MapPin,
  Spinner,
  ArrowClockwise,
} from "@phosphor-icons/react";

export default function RiskAnalysisCard() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/risk-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lat: -6.2383,
          lon: 106.9756,
          locationName: "Kota Bekasi, Jawa Barat",
        }),
      });

      const result = await res.json();
      if (result.success) {
        setData(result);
      }
    } catch (err) {
      console.error("Gagal mengambil data risiko:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm space-y-4">
      {/* Header & Tombol Cek */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-red-50 text-red-600">
            <ShieldWarning size={20} weight="fill" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-sm">
              Analisis Risiko ML & AI
            </h3>
            <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
              <MapPin size={12} /> Kota Bekasi, Jawa Barat
            </p>
          </div>
        </div>

        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-900 text-white text-xs font-medium hover:bg-gray-800 disabled:opacity-50 transition-colors"
        >
          {loading ? (
            <Spinner size={14} className="animate-spin" />
          ) : (
            <ArrowClockwise size={14} />
          )}
          {data ? "Analisis Ulang" : "Cek Kerentanan"}
        </button>
      </div>

      {/* Konten Hasil Analisis */}
      {data && (
        <div className="space-y-4">
          {/* Section 1: Skor dari Machine Learning */}
          <div className="bg-gray-50 p-3.5 rounded-lg border border-gray-100">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-medium text-gray-600">
                Skor Kerentanan ML
              </span>
              <span className="text-sm font-bold text-red-600">
                {data.mlResult.vulnerabilityScore} / 100 (
                {data.mlResult.category})
              </span>
            </div>
            <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
              <div
                className="bg-red-500 h-full transition-all duration-500"
                style={{ width: `${data.mlResult.vulnerabilityScore}%` }}
              />
            </div>
            <div className="mt-2.5 grid grid-cols-2 gap-2 text-[11px] text-gray-500">
              <div>
                • Frekuensi: {data.mlResult.features.freqPerYear} kali/thn
              </div>
              <div>
                • Gempa &ge; M 5.0: {data.mlResult.features.m5Count} kali
              </div>
            </div>
          </div>

          {/* Section 2: Saran & Penjelasan dari Gemini AI */}
          <div className="rounded-lg border border-indigo-100 bg-indigo-50/40 p-3.5">
            <div className="flex items-center gap-1.5 text-indigo-900 font-bold text-xs mb-2">
              <Robot size={16} weight="fill" className="text-indigo-600" />
              <span>Rekomendasi & Analisis Gemini AI</span>
            </div>
            <div className="text-xs text-gray-700 leading-relaxed whitespace-pre-line">
              {data.aiAdvice}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
