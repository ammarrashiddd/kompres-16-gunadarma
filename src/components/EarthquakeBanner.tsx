"use client";

import { useEffect, useState } from "react";
import type { GempaData } from "@/types";

interface BmkgResponse {
  Infogempa: {
    gempa: GempaData;
  };
}

export default function EarthquakeBanner(): React.JSX.Element {
  const [gempa, setGempa] = useState<GempaData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGempa = async (): Promise<void> => {
      try {
        const res = await fetch("https://data.bmkg.go.id/DataMKG/TEWS/autogempa.json");
        if (!res.ok) throw new Error("Gagal mengambil data gempa");
        const data: BmkgResponse = await res.json();
        setGempa(data.Infogempa.gempa);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Terjadi kesalahan");
      } finally {
        setLoading(false);
      }
    };

    fetchGempa();
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse bg-white/10 h-24 rounded-xl" />
    );
  }

  if (error || !gempa) {
    return (
      <div className="text-sm text-slate-400 text-center py-4">
        Data gempa tidak tersedia
      </div>
    );
  }

  return (
    <div className="bg-red-500/10 border-2 border-red-500/50 p-5 rounded-xl text-center backdrop-blur-sm">
      <p className="font-bold text-red-400 text-lg">
        🌍 Gempa Terkini: M{gempa.Magnitude}
      </p>
      <p className="text-sm text-slate-300 mt-1">{gempa.Wilayah}</p>
      <p className="text-xs text-slate-400 mt-1">
        {gempa.Tanggal} • {gempa.Jam}
      </p>
      {gempa.Potensi && (
        <p className="text-xs mt-2 font-semibold text-amber-400">{gempa.Potensi}</p>
      )}
    </div>
  );
}
