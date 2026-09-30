"use client";

import { X } from "@phosphor-icons/react";
import { CircleMarker, MapContainer, Popup, TileLayer } from "react-leaflet";
import type { CommunityPost } from "@/lib/api";

const INDONESIA_BOUNDS: [[number, number], [number, number]] = [
  [-15, 92],
  [10, 143],
];

interface CommunityReportMapProps {
  posts: CommunityPost[];
  onClose: () => void;
}

export default function CommunityReportMap({
  posts,
  onClose,
}: CommunityReportMapProps) {
  const mappedPosts = posts.filter(
    (post) =>
      typeof post.latitude === "number" &&
      typeof post.longitude === "number" &&
      Number.isFinite(post.latitude) &&
      Number.isFinite(post.longitude),
  );

  return (
    <div className="overflow-hidden rounded-[24px] border border-[#dedbd5] bg-[#eeece8] p-2 shadow-[0_12px_30px_rgba(48,43,38,0.06)]">
      <div className="relative h-[min(72vh,760px)] min-h-[460px] w-full overflow-hidden rounded-[18px]">
        <button
          aria-label="Tutup peta laporan"
          className="absolute right-3 top-3 z-[500] rounded-xl border border-white/70 bg-[#fffaf0]/95 p-2 text-[#55524e] shadow-sm backdrop-blur-sm transition hover:bg-white hover:text-[#a44b29]"
          onClick={onClose}
          type="button"
        >
          <X size={18} />
        </button>
        <MapContainer
          center={[-2.5489, 118.0149]}
          className="h-full w-full"
          maxBounds={INDONESIA_BOUNDS}
          maxBoundsViscosity={0.8}
          minZoom={4}
          scrollWheelZoom
          zoom={5}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {mappedPosts.map((post) => (
            <CircleMarker
              center={[post.latitude as number, post.longitude as number]}
              fillColor={
                post.damageLevel === "DARURAT"
                  ? "#b42318"
                  : post.damageLevel === "BERAT"
                    ? "#c85b31"
                    : post.damageLevel === "SEDANG"
                      ? "#b7791f"
                      : "#3b7045"
              }
              fillOpacity={0.9}
              key={post.id}
              pathOptions={{ color: "#fffaf6", weight: 2 }}
              radius={8}
              stroke
            >
              <Popup>
                <div className="min-w-44 p-1">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-[#a44b29]">
                    {post.damageLevel}
                  </p>
                  <h3 className="mt-1 text-sm font-semibold text-[#202123]">
                    {post.title}
                  </h3>
                  <p className="mt-1 text-xs text-[#777572]">
                    {post.locationName}
                  </p>
                  <p className="mt-2 text-xs leading-5 text-[#55524e]">
                    {post.description}
                  </p>
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>

        <div className="pointer-events-none absolute bottom-4 left-4 rounded-xl border border-white/70 bg-[#fffaf0]/95 px-3 py-2 text-xs text-[#55524e] shadow-sm backdrop-blur-sm">
          {mappedPosts.length > 0
            ? `${mappedPosts.length} titik laporan terlihat`
            : "Belum ada laporan dengan koordinat"}
        </div>
      </div>
    </div>
  );
}
