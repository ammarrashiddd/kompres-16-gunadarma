"use client";

import Link from "next/link";
import {
  Robot,
  ShieldWarning,
  ArrowRight,
  WarningOctagon,
} from "@phosphor-icons/react";

const PLATE_LEGENDS = [
  { code: "SU", name: "Lempeng Sunda", area: "Sumatera, Jawa, Kalimantan" },
  {
    code: "AU",
    name: "Lempeng Australia",
    area: "Samudra Hindia (Selatan Jawa/Nusa Tenggara)",
  },
  { code: "PA", name: "Lempeng Pasifik", area: "Utara Papua & Maluku Utara" },
  {
    code: "PH",
    name: "Lempeng Laut Filipina",
    area: "Utara Sulawesi & Halmahera",
  },
];

export default function QuickActionsAndPlates() {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.7fr_1fr]">
      <div className="rounded-[24px] border border-[#e3e1dc] bg-[#e8ddd5] p-5 shadow-[0_10px_24px_rgba(48,43,38,0.05)] md:p-6">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#e1e1e5] bg-white px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#5f5f65]">
          <Robot size={15} weight="fill" className="text-[#a15d3c]" />
          SIGAP AI Assistant
        </div>

        <h3 className="text-[clamp(1.5rem,2vw,2rem)] font-semibold tracking-[-0.06em] text-[#1d1d1f]">
          Butuh Panduan Evakuasi Darurat?
        </h3>
        <p className="mt-2 max-w-xl text-sm leading-6 text-[#6e6e73]">
          Dapatkan rekomendasi evakuasi real-time berdasarkan kondisi lokasi,
          infrastruktur sekitar, dan tingkat keparahan bencana.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Link
            href="/evacuation-assistant"
            className="inline-flex items-center gap-2 rounded-full bg-[#202123] px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-[#353638] active:scale-[0.98]"
          >
            <span>Tanya Asisten</span>
            <ArrowRight size={16} weight="bold" />
          </Link>

          <Link
            href="/risk-analysis"
            className="inline-flex items-center gap-2 rounded-full border border-[#dfe0e4] bg-white px-4 py-2.5 text-sm font-medium text-[#1d1d1f] transition-all hover:bg-[#f7f7f8]"
          >
            <ShieldWarning size={16} />
            <span>Analisis Risiko</span>
          </Link>
        </div>
      </div>

      <div className="rounded-[24px] border border-[#e3e1dc] bg-white p-5 shadow-[0_10px_24px_rgba(48,43,38,0.04)] md:p-6">
        <div className="mb-4 flex items-center gap-2 border-b border-[#f1f1f4] pb-3">
          <WarningOctagon size={18} className="text-[#d66666]" weight="fill" />
          <h4 className="text-sm font-semibold text-[#1d1d1f]">
            Lempeng Tektonik Utama
          </h4>
        </div>

        <div className="space-y-3">
          {PLATE_LEGENDS.map((item) => (
            <div
              key={item.code}
              className="flex items-start gap-3 rounded-[18px] bg-[#f7f7f8] px-3 py-2.5"
            >
              <span className="inline-flex min-w-[38px] justify-center rounded-[10px] bg-white px-2 py-1 font-mono text-[11px] font-bold text-[#1d1d1f] shadow-[0_1px_0_rgba(0,0,0,0.02)]">
                {item.code}
              </span>
              <div>
                <p className="text-sm font-medium text-[#1d1d1f]">
                  {item.name}
                </p>
                <p className="text-[11px] text-[#7d7d82]">{item.area}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
