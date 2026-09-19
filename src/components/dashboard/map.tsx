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

// Fix icon marker default Leaflet
const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
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
  const [isMounted, setIsMounted] = useState(false); // Fix SSR/Hydration Issue

  useEffect(() => {
    setIsMounted(true); // Pastikan sudah di client

    async function fetchData() {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

        const eqRes = await fetch(
          `${baseUrl}/feed/v1.0/summary/2.5_day.geojson`,
        );
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

        const platesRes = await fetch(
          "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_plates.json",
        );
        const platesGeoJson = await platesRes.json();
        setPlatesData(platesGeoJson);
      } catch (error) {
        console.error("Gagal memuat data peta:", error);
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
        <span style="font-size: 10px; font-weight: bold; color: #dc3545; text-transform: uppercase;">Kode Lempeng</span>
        <h4 style="margin: 2px 0 6px 0; font-size: 14px; color: #111827; font-weight: bold;">
          ${plateCode}
        </h4>
      </div>
    `);
  };

  // Jangan render apa-apa jika belum dipastikan ter-mount di browser client
  if (!isMounted || loading) {
    return (
      <div className="flex h-125 w-full items-center justify-center rounded-xl bg-gray-100">
        <p className="text-gray-500 font-medium">
          Memuat data gempa & patahan lempeng Indonesia...
        </p>
      </div>
    );
  }

  return (
    <div
      style={{ height: "500px", width: "100%" }}
      className="rounded-xl overflow-hidden border border-gray-200 shadow-sm"
    >
      <MapContainer
        key="indonesia-map-container" // Mencegah reutilisasi ID container pada Leaflet
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
                  color: "#ff3333",
                  weight: 4,
                  opacity: 0.8,
                  fill: false,
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
                  <h4 className="font-bold text-sm text-gray-900">
                    {eq.properties.title}
                  </h4>
                  <p className="text-xs text-gray-600 mt-1">
                    <strong>Magnitudo:</strong> M {eq.properties.mag}
                  </p>
                  <p className="text-xs text-gray-600">
                    <strong>Kedalaman:</strong> {depth} km
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
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
