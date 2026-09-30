"use client";

import RiskAnalysisSection from "@/components/Ai/RiskAnalysisSection";
import MapGempa from "@/components/mapGempa/page";
import Navbar from "@/components/navbar/Navbar";

export default function Dashboard() {
  return (
    <main className="min-h-screen bg-[#e9e7e5] px-3 py-3 text-[#202123] md:px-6 md:py-6 lg:px-8">
      <div className="mx-auto max-w-360 rounded-[30px] bg-[#f7f7f5] p-3 shadow-[0_24px_70px_rgba(48,43,38,0.12)] md:p-5 lg:p-6">
        <nav className="mb-7 px-1 md:px-2">
          <Navbar />
        </nav>

        <div className="mb-6 flex flex-col justify-between gap-3 px-1 md:flex-row md:items-end md:px-2">
          <div>
            <h2 className="text-[clamp(1.8rem,3vw,2.8rem)] font-semibold tracking-[-0.07em] text-[#202123]">
              Selamat datang kembali.
            </h2>
          </div>
          <p className="max-w-xs text-left text-xs leading-5 text-[#777572] md:text-right">
            Pantau aktivitas seismik dan kesiapan evakuasi Indonesia dalam satu
            pandangan.
          </p>
        </div>

        <div className="space-y-6">
          <MapGempa />
          <RiskAnalysisSection />
        </div>
      </div>
    </main>
  );
}
