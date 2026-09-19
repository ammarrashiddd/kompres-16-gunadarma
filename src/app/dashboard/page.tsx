"use client";

import SideMap from "@/components/dashboard/sideMap";
import Navbar from "@/components/navbar/page";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// Dynamic import untuk mematikan Server-Side Rendering pada komponen Map
const Map = dynamic(() => import("@/components/dashboard/map"), {
  ssr: false, // <-- Ini mematikan SSR agar 'window is not defined' hilang
  loading: () => (
    <div className="flex h-125 w-full items-center justify-center rounded-xl bg-gray-100">
      <p className="text-gray-500 font-medium">Memuat Peta...</p>
    </div>
  ),
});

export default function Dashboard() {
  const [earthquakes, setEarthquakes] = useState([]);

  useEffect(() => {
    async function fetchEarthquakes() {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        const eqRes = await fetch(
          `${baseUrl}/feed/v1.0/summary/2.5_day.geojson`,
        );
        const eqData = await eqRes.json();

        // Filter wilayah Indonesia
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
        console.error(err);
      }
    }

    fetchEarthquakes();
  }, []);

  return (
    <main>
      <nav className="pl-8 pr-8 pt-8">
        <Navbar />
      </nav>
      <div className="flex flex-row gap-4 p-8">
        <div className="w-[75%]">
          <Map />
        </div>
        <div className="w-[25%]">
          <SideMap earthquakes={earthquakes} />
        </div>
      </div>
    </main>
  );
}
