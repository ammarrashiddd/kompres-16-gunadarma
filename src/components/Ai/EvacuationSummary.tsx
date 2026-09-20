"use client";

import {
  Robot,
  WarningCircle,
  CheckCircle,
  Package,
} from "@phosphor-icons/react";

interface EvacuationSummaryProps {
  locationName?: string;
  isEmergency?: boolean;
}

export default function EvacuationSummary({
  locationName = "Lokasi Anda saat ini",
  isEmergency = false,
}: EvacuationSummaryProps) {
  const immediateActions = [
    "Merunduk, lindungi kepala, dan bertahan (Drop, Cover, Hold On).",
    "Jauhi kaca, jendela, serta benda yang berpotensi roboh.",
    "Jangan gunakan lift, gunakan tangga darurat secara tertib.",
  ];

  const itemsToBring = [
    "Air minum & makanan siap saji",
    "Kotak P3K & obat-obatan pribadi",
    "Dokumen penting & ponsel",
  ];

  return (
    <div className="rounded-[24px] border border-[#e3e1dc] bg-white p-5 shadow-[0_10px_24px_rgba(48,43,38,0.04)] md:p-6">
      <div className="mb-4 flex items-center justify-between border-b border-[#f2f2f4] pb-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-[12px] bg-[#f2f1ff] text-[#4d4d9f]">
            <Robot size={18} weight="fill" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[#1d1d1f]">
              Panduan Evakuasi
            </h3>
            <p className="text-[11px] text-[#7d7d82]">{locationName}</p>
          </div>
        </div>
        <span
          className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${
            isEmergency
              ? "bg-[#fce7e7] text-[#a83a3a]"
              : "bg-[#edf7ee] text-[#2f6e3a]"
          }`}
        >
          {isEmergency ? "Siaga" : "Aman"}
        </span>
      </div>

      <div className="mb-4">
        <h4 className="mb-2 flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.14em] text-[#8a8a8f]">
          <WarningCircle size={15} className="text-[#c69a2d]" weight="fill" />
          Tindakan utama
        </h4>
        <ul className="space-y-2">
          {immediateActions.map((action, idx) => (
            <li
              key={idx}
              className="flex items-start gap-2 rounded-[18px] border border-[#f2f2f4] bg-[#fafafb] p-2.5 text-sm text-[#2a2a2d]"
            >
              <CheckCircle
                size={16}
                className="mt-0.5 shrink-0 text-[#4d8a56]"
                weight="fill"
              />
              <span>{action}</span>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h4 className="mb-2 flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.14em] text-[#8a8a8f]">
          <Package size={15} className="text-[#4e6ea7]" weight="fill" />
          Tas siaga bencana
        </h4>
        <div className="flex flex-wrap gap-2">
          {itemsToBring.map((item, idx) => (
            <span
              key={idx}
              className="inline-flex items-center rounded-full border border-[#ececf0] bg-[#fafafb] px-2.5 py-1.5 text-[11px] text-[#2a2a2d]"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
