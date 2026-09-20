"use client";

import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  GeoJSON,
  LayersControl,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { renderToString } from "react-dom/server";
import { MapPinLineIcon } from "@phosphor-icons/react";

const customIcon = L.divIcon({
  className: "custom-phosphor-marker",
  html: renderToString(
    <div className="flex items-center justify-center drop-shadow-md transition-transform hover:scale-110">
      <MapPinLineIcon size={28} color="#d76767" weight="fill" />
    </div>,
  ),
  iconSize: [28, 28],
  iconAnchor: [14, 14],
  popupAnchor: [0, -12],
});

const INDONESIA_BOUNDS: L.LatLngBoundsExpression = [
  [-15.0, 92.0],
  [10.0, 143.0],
];

interface EarthquakeFeature {
  id: string;
  properties: {
    title: string;
    mag: number;
    place: string;
    time: number;
  };
  geometry: {
    coordinates: [number, number, number];
  };
}

export default function Map() {
  const [earthquakes, setEarthquakes] = useState<EarthquakeFeature[]>([]);
  const [platesData, setPlatesData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    async function fetchData() {
      try {
        const rawBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://earthquake.usgs.gov";
        const baseUrl = rawBaseUrl.endsWith("/earthquakes")
          ? rawBaseUrl
          : `${rawBaseUrl}/earthquakes`;

        const eqRes = await fetch(
          `${baseUrl}/feed/v1.0/summary/2.5_day.geojson`,
        );

        if (eqRes.ok) {
          const eqData = await eqRes.json();
          const filteredEarthquakes = (eqData.features || []).filter(
            (eq: EarthquakeFeature) => {
              const [longitude, latitude] = eq.geometry.coordinates;
              return (
                latitude >= -11.0 &&
                latitude <= 6.0 &&
                longitude >= 94.0 &&
                longitude <= 141.0
              );
            },
          );
          setEarthquakes(filteredEarthquakes);
        }

        try {
          const platesRes = await fetch(
            "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_plates.json",
          );
          if (platesRes.ok) {
            const platesGeoJson = await platesRes.json();
            setPlatesData(platesGeoJson);
          }
        } catch (plateErr) {
          console.warn("Gagal memuat data lempeng tektonik:", plateErr);
        }
      } catch (error) {
        console.error("Gagal memuat data gempa:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const onEachPlate = (feature: any, layer: L.Layer) => {
    const plateCode =
      feature.properties?.PlateName ||
      feature.properties?.Name ||
      feature.properties?.LAYER ||
      "N/A";

    layer.bindPopup(`
      <div style="padding: 4px; font-family: sans-serif;">
        <span style="font-size: 10px; font-weight: bold; color: #d76767; text-transform: uppercase;">Lempeng Tektonik</span>
        <h4 style="margin: 2px 0 6px 0; font-size: 14px; color: #111827; font-weight: bold;">
          ${plateCode}
        </h4>
      </div>
    `);
  };

  if (!isMounted || loading) {
    return (
      <div className="flex h-[420px] w-full items-center justify-center rounded-[20px] bg-[#f9f9f7] text-sm font-medium text-[#6e6e73]">
        Memuat data gempa & patahan lempeng Indonesia...
      </div>
    );
  }

  return (
    <div
      style={{ height: "420px", width: "100%" }}
      className="overflow-hidden rounded-[20px] border border-[#dedbd5] bg-[#f9f9f7]"
    >
      <MapContainer
        key="indonesia-map-container"
        center={[-2.5489, 118.0149]}
        zoom={5}
        minZoom={4}
        maxBounds={INDONESIA_BOUNDS}
        maxBoundsViscosity={0.8}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
      >
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="Street Map (OSM)">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>

          <LayersControl.BaseLayer name="Satelit (Esri)">
            <TileLayer
              attribution="Tiles &copy; Esri"
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            />
          </LayersControl.BaseLayer>

          {platesData && (
            <LayersControl.Overlay name="Garis Patahan Lempeng">
              <GeoJSON
                data={platesData}
                style={{
                  color: "#d76767",
                  weight: 2,
                  opacity: 0.8,
                }}
                onEachFeature={onEachPlate}
              />
            </LayersControl.Overlay>
          )}
        </LayersControl>

        {earthquakes.map((eq) => {
          const [longitude, latitude, depth] = eq.geometry.coordinates;
          return (
            <Marker
              key={eq.id}
              position={[latitude, longitude]}
              icon={customIcon}
            >
              <Popup>
                <div className="p-1">
                  <h4 className="text-sm font-bold text-[#111827]">
                    {eq.properties.title}
                  </h4>
                  <p className="mt-1 text-xs text-[#4b5563]">
                    <strong>Magnitudo:</strong> M {eq.properties.mag}
                  </p>
                  <p className="text-xs text-[#4b5563]">
                    <strong>Kedalaman:</strong> {depth} km
                  </p>
                  <p className="mt-1 text-[11px] text-[#6b7280]">
                    {new Date(eq.properties.time).toLocaleString("id-ID")}
                  </p>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
