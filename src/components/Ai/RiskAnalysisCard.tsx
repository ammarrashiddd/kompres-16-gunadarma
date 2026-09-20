"use client";

import { ShieldWarning, MapPin, TrendUp } from "@phosphor-icons/react";

interface RiskAnalysisCardProps {
  locationName?: string;
  riskScore?: number;
  faultDistanceKm?: number;
}

export default function RiskAnalysisCard({
  locationName = "Jakarta & Sejakatnya",
  riskScore = 65,
  faultDistanceKm = 42,
}: RiskAnalysisCardProps) {
  const getRiskBadge = (score: number) => {
    if (score >= 75)
      return { label: "Tinggi", tone: "bg-[#fce7e7] text-[#a83a3a]" };
    if (score >= 45)
      return { label: "Sedang", tone: "bg-[#fff4df] text-[#a66b00]" };
    return { label: "Rendah", tone: "bg-[#edf7ee] text-[#2f6e3a]" };
  };

  const badge = getRiskBadge(riskScore);

  return (
    <div className="rounded-[24px] border border-[#e3e1dc] bg-white p-5 shadow-[0_10px_24px_rgba(48,43,38,0.04)] md:p-6">
      <div className="mb-4 flex items-center justify-between border-b border-[#f2f2f4] pb-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-[#fce7e7] text-[#a83a3a]">
            <ShieldWarning size={20} weight="fill" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[#1d1d1f]">
              Analisis Risiko Lokasi
            </h3>
            <p className="mt-1 flex items-center gap-1 text-[11px] text-[#7d7d82]">
              <MapPin size={12} /> {locationName}
            </p>
          </div>
        </div>
        <span
          className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${badge.tone}`}
        >
          Risiko {badge.label}
        </span>
      </div>

      <div className="mb-4">
        <div className="mb-2 flex items-end justify-between">
          <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-[#8a8a8f]">
            Skor Kerawanan
          </span>
          <span className="text-[clamp(1.8rem,2vw,2.3rem)] font-semibold tracking-[-0.06em] text-[#1d1d1f]">
            {riskScore}
            <span className="text-xs font-medium text-[#8a8a8f]">/100</span>
          </span>
        </div>
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#f1f1f4]">
          <div
            className={`h-full rounded-full ${
              riskScore >= 75
                ? "bg-[#d66666]"
                : riskScore >= 45
                  ? "bg-[#d9a84f]"
                  : "bg-[#61b36d]"
            }`}
            style={{ width: `${riskScore}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 rounded-[20px] border border-[#f1f1f4] bg-[#f9f9fb] p-3">
        <div>
          <span className="block text-[10px] uppercase tracking-[0.12em] text-[#8a8a8f]">
            Jarak Patahan
          </span>
          <span className="mt-1 block text-sm font-medium text-[#1d1d1f]">
            ± {faultDistanceKm} km
          </span>
        </div>
        <div>
          <span className="block text-[10px] uppercase tracking-[0.12em] text-[#8a8a8f]">
            Frekuensi Gempa
          </span>
          <span className="mt-1 flex items-center gap-1 text-sm font-medium text-[#1d1d1f]">
            <TrendUp size={14} className="text-[#b1862d]" /> 14 kejadian
          </span>
        </div>
      </div>
    </div>
  );
}
