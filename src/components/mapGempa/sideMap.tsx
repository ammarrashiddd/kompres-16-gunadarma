"use client";

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

interface SideMapProps {
  earthquakes: EarthquakeFeature[];
  onSelectEarthquake?: (lat: number, lng: number) => void;
}

export default function SideMap({
  earthquakes,
  onSelectEarthquake,
}: SideMapProps) {
  return (
    <aside className="flex h-[420px] w-full flex-col overflow-hidden rounded-[24px] border border-[#e3e1dc] bg-[#fbfbf9] shadow-[0_10px_25px_rgba(48,43,38,0.04)]">
      <div className="border-b border-[#ebe9e5] bg-[#f2f1ee] px-4 py-3.5">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-[#202123]">
          <span className="h-2.5 w-2.5 rounded-full bg-[#d76767]" />
          Gempa Terkini ({earthquakes.length})
        </h3>
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto p-2">
        {earthquakes.length === 0 ? (
          <div className="flex h-full items-center justify-center p-4 text-center text-xs text-[#7a7269]">
            Tidak ada data gempa terbaru.
          </div>
        ) : (
          earthquakes.map((eq) => {
            const [longitude, latitude, depth] = eq.geometry.coordinates;
            const isHighMag = eq.properties.mag >= 5.0;

            return (
              <div
                key={eq.id}
                onClick={() => onSelectEarthquake?.(latitude, longitude)}
                className="cursor-pointer rounded-[16px] border border-[#eceae6] bg-white p-3 transition-all hover:-translate-y-0.5 hover:border-[#ded5cd] hover:bg-[#fdfbf9]"
              >
                <div className="flex items-start justify-between gap-2">
                  <span
                    className={`inline-flex items-center justify-center rounded-full px-2 py-1 text-[10px] font-bold ${
                      isHighMag
                        ? "bg-[#f9d9d5] text-[#8c2b27]"
                        : "bg-[#f6ebd8] text-[#8b5a00]"
                    }`}
                  >
                    M {eq.properties.mag.toFixed(1)}
                  </span>
                  <span className="text-[10px] text-[#8a8179]">
                    {new Date(eq.properties.time).toLocaleTimeString("id-ID", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>

                <p className="mt-2 text-xs font-medium leading-5 text-[#1f1f1f]">
                  {eq.properties.place || eq.properties.title}
                </p>

                <div className="mt-2 text-[11px] text-[#7a7269]">
                  Kedalaman: {depth} km
                </div>
              </div>
            );
          })
        )}
      </div>
    </aside>
  );
}
