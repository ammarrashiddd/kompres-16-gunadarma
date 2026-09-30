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
  const score = data ? Math.min(Math.max(data.vulnerabilityScore, 0), 100) : 0;

  return (
    <section className="space-y-5 rounded-2xl border border-[#dedbd5] bg-white p-5 shadow-[0_12px_30px_rgba(48,43,38,0.06)] md:p-6">
      <div className="flex items-start justify-between gap-4 border-b border-[#f0efed] pb-4">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#f1e5df] text-[#c85b31]">
            <ShieldWarning size={21} weight="fill" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#c85b31]">
              Penilaian berbasis data
            </p>
            <h3 className="mt-1 text-base font-semibold text-[#202123]">
              Analisis risiko gempa
            </h3>
            <p className="mt-1 flex items-center gap-1 truncate text-xs text-[#777572]">
              <MapPin className="shrink-0 text-[#c85b31]" size={13} />
              {locationName ?? "Kota belum dipilih"}
            </p>
          </div>
        </div>

        <button
          className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-[#202123] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#38393a] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
          disabled={loading}
          onClick={onAnalyze}
          type="button"
        >
          {loading ? (
            <Spinner className="animate-spin" size={14} />
          ) : (
            <ArrowClockwise size={14} />
          )}
          {data ? "Analisis Ulang" : "Cek Kerentanan"}
        </button>
      </div>

      {error && (
        <p className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-3 text-xs leading-5 text-red-700">
          {error}
        </p>
      )}

      {loading && !data ? (
        <div className="space-y-4 rounded-xl border border-[#eeece8] bg-[#fbfaf9] p-4">
          <div className="flex animate-pulse items-center justify-between">
            <div className="h-3 w-32 rounded bg-[#e5e3df]" />
            <div className="h-5 w-24 rounded bg-[#e5e3df]" />
          </div>
          <div className="h-2 animate-pulse rounded-full bg-[#e5e3df]" />
          <div className="grid animate-pulse grid-cols-2 gap-3">
            <div className="h-12 rounded-lg bg-[#e5e3df]" />
            <div className="h-12 rounded-lg bg-[#e5e3df]" />
            <div className="h-12 rounded-lg bg-[#e5e3df]" />
            <div className="h-12 rounded-lg bg-[#e5e3df]" />
          </div>
        </div>
      ) : data ? (
        <div className="rounded-xl border border-[#eeece8] bg-[#fbfaf9] p-4">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#777572]">
                Skor kerentanan
              </p>
              <p className="mt-1 font-mono text-3xl font-semibold tabular-nums tracking-tight text-[#202123]">
                {data.vulnerabilityScore}
                <span className="ml-1 text-sm font-normal text-[#99958f]">
                  / 100
                </span>
              </p>
            </div>
            <span className="rounded-lg bg-[#f1e5df] px-2.5 py-1.5 text-xs font-semibold text-[#a44b29]">
              {data.category}
            </span>
          </div>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-[#e5e3df]">
            <div
              className="h-full rounded-full bg-[#c85b31] transition-all duration-500"
              style={{ width: `${score}%` }}
            />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3">
            <Metric
              label="Frekuensi tahunan"
              value={`${data.features.freqPerYear} kali`}
            />
            <Metric
              label="Gempa ≥ M 5.0"
              value={`${data.features.m5Count} kali`}
            />
            <Metric
              label="Magnitudo maksimum"
              value={`M ${data.features.maxMagnitude}`}
            />
            <Metric
              label="Kedalaman rata-rata"
              value={`${data.features.avgDepthKm} km`}
            />
            <Metric
              label="Gempa M 5+ terdekat"
              value={`${data.features.nearestM5DistanceKm} km`}
            />
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-[#d8d5d0] bg-[#fbfaf9] px-4 py-8 text-center">
          <p className="text-sm font-semibold text-[#4b4a47]">
            Belum ada penilaian untuk kota ini
          </p>
          <p className="mt-1 text-xs leading-5 text-[#777572]">
            Jalankan analisis untuk melihat ringkasan kerentanan berbasis data.
          </p>
        </div>
      )}
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-t border-[#e5e3df] pt-2.5">
      <p className="text-[10px] font-medium uppercase tracking-[0.08em] text-[#99958f]">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold tabular-nums text-[#4b4a47]">
        {value}
      </p>
    </div>
  );
}
