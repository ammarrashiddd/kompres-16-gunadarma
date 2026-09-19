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
    coordinates: [number, number, number]; // [longitude, latitude, depth]
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
    <aside className="flex h-125 w-full flex-col rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      {/* Header */}
      <div className="border-b border-gray-100 bg-gray-50/80 px-4 py-3">
        <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
          Gempa Terkini ({earthquakes.length})
        </h3>
      </div>

      {/* List Gempa */}
      <div className="flex-1 overflow-y-auto divide-y divide-gray-100 p-2">
        {earthquakes.length === 0 ? (
          <div className="flex h-full items-center justify-center text-center text-xs text-gray-400 p-4">
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
                className="group p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <span
                    className={`inline-flex items-center justify-center rounded-md px-2 py-1 text-xs font-bold ${
                      isHighMag
                        ? "bg-red-100 text-red-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    M {eq.properties.mag.toFixed(1)}
                  </span>
                  <span className="text-[10px] text-gray-400">
                    {new Date(eq.properties.time).toLocaleTimeString("id-ID", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>

                <p className="mt-1.5 text-xs font-medium text-gray-800 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {eq.properties.place || eq.properties.title}
                </p>

                <div className="mt-2 flex items-center justify-between text-[11px] text-gray-500">
                  <span>Kedalaman: {depth} km</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </aside>
  );
}
