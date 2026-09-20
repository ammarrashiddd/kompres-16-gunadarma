"use client";

import { useEffect, useState } from "react";
import SideMap from "./sideMap";
import dynamic from "next/dynamic";

const Map = dynamic(() => import("@/components/mapGempa/map"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[420px] w-full items-center justify-center rounded-[24px] border border-[#e7e2d9] bg-[#f3f1ee] text-sm font-medium text-[#6a625a]">
      Memuat peta...
    </div>
  ),
});

export default function MapGempa() {
  const [earthquakes, setEarthquakes] = useState([]);

  useEffect(() => {
    async function fetchEarthquakes() {
      try {
        const rawBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://earthquake.usgs.gov";
        const baseUrl = rawBaseUrl.endsWith("/earthquakes")
          ? rawBaseUrl
          : `${rawBaseUrl}/earthquakes`;

        const eqRes = await fetch(
          `${baseUrl}/feed/v1.0/summary/2.5_day.geojson`,
        );

        if (!eqRes.ok) return;

        const eqData = await eqRes.json();
        const filtered = (eqData.features || []).filter((eq: any) => {
          const [longitude, latitude] = eq.geometry.coordinates;
          return (
            latitude >= -11.0 &&
            latitude <= 6.0 &&
            longitude >= 94.0 &&
            longitude <= 141.0
          );
        });

        setEarthquakes(filtered);
      } catch (err) {
        console.error("Gagal memuat gempa:", err);
      }
    }

    fetchEarthquakes();
  }, []);

  return (
    <section className="w-full">
      <div className="mb-3 flex items-center justify-between px-1 md:px-2">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#a15d3c]">
            Live monitoring
          </p>
          <h3 className="mt-1 text-lg font-semibold tracking-[-0.04em] text-[#202123]">
            Aktivitas gempa terkini
          </h3>
        </div>
        <span className="hidden rounded-full bg-[#e8f2e8] px-3 py-1.5 text-[10px] font-semibold text-[#3b7045] sm:inline-flex sm:items-center sm:gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-[#4d9a5b]" />
          Data aktif
        </span>
      </div>
      <div className="flex min-w-0 flex-col gap-4 lg:flex-row">
        <div className="min-h-[360px] min-w-0 flex-1 overflow-hidden rounded-[24px] border border-[#e3e1dc] bg-[#eeece8] p-2 shadow-[0_10px_25px_rgba(48,43,38,0.05)]">
          <Map />
        </div>
        <div className="min-w-0 lg:w-[350px]">
          <SideMap earthquakes={earthquakes} />
        </div>
      </div>
    </section>
  );
}
