"use client";

import {
  ActivityIcon,
  Compass,
  WarningIcon,
  Waves,
} from "@phosphor-icons/react";

interface DashboardStatsProps {
  totalEarthquakes: number;
  maxMagnitude: number;
  highRiskCount: number;
}

export default function DashboardStats({
  totalEarthquakes,
  maxMagnitude,
  highRiskCount,
}: DashboardStatsProps) {
  const stats = [
    {
      label: "Total Gempa",
      value: totalEarthquakes,
      suffix: "kejadian",
      icon: <ActivityIcon size={20} weight="fill" />,
      tone: "bg-[#edf7ee] text-[#2f6e3a]",
    },
    {
      label: "Magnitudo",
      value: `M ${maxMagnitude > 0 ? maxMagnitude.toFixed(1) : "-"}`,
      suffix: "tertinggi",
      icon: <Waves size={20} weight="fill" />,
      tone: "bg-[#fff4df] text-[#a66b00]",
    },
    {
      label: "Wilayah Siaga",
      value: highRiskCount,
      suffix: "lokasi",
      icon: <WarningIcon size={20} weight="fill" />,
      tone: "bg-[#fce7e7] text-[#aa3b3b]",
    },
    {
      label: "Zona Aktif",
      value: "Sunda",
      suffix: "Megathrust",
      icon: <Compass size={20} weight="fill" />,
      tone: "bg-[#eef3ff] text-[#3552a8]",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="flex items-center justify-between rounded-[20px] border border-[#e3e1dc] bg-white p-4 shadow-[0_8px_20px_rgba(48,43,38,0.035)] transition-transform hover:-translate-y-0.5"
        >
          <div className="min-w-0">
            <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-[#8a8a8f]">
              {stat.label}
            </p>
            <h3 className="mt-2 text-[clamp(1.7rem,2vw,2.2rem)] font-semibold tracking-[-0.06em] text-[#1d1d1f]">
              {stat.value}
            </h3>
            {stat.suffix ? (
              <p className="text-[11px] text-[#8a8a8f]">{stat.suffix}</p>
            ) : null}
          </div>
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-[18px] ${stat.tone}`}
          >
            {stat.icon}
          </div>
        </div>
      ))}
    </div>
  );
}
