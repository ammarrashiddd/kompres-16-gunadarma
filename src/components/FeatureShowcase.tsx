import type { Feature } from "@/types";

const features: Omit<Feature, "icon">[] = [
  {
    id: 1,
    title: "Analisis Risiko Lokasi",
    description: "Deteksi otomatis skor risiko bencana di lokasimu.",
  },
  {
    id: 2,
    title: "Asisten Evakuasi AI",
    description: "Panduan darurat via chat teks & suara.",
  },
  {
    id: 3,
    title: "Peta Safe Zone",
    description: "Temukan rute evakuasi & titik pengungsian terdekat.",
  },
  {
    id: 4,
    title: "Lapor Warga",
    description: "Laporkan kejadian dengan verifikasi anti-hoax AI.",
  },
  {
    id: 5,
    title: "Panduan Terpersonalisasi",
    description: "Disesuaikan untuk anak, lansia, atau disabilitas.",
  },
  {
    id: 6,
    title: "Mode Darurat Otomatis",
    description: "UI otomatis berubah high-contrast saat alert aktif.",
  },
];

const featureIcons = ["📍", "🤖", "🗺️", "📢", "👥", "🚨"];

export default function FeatureShowcase(): React.JSX.Element {
  return (
    <section className="py-20 container mx-auto px-4 max-w-6xl">
      <h2 className="text-3xl font-bold text-center mb-3 text-slate-100">
        Fitur Unggulan
      </h2>
      <p className="text-center text-slate-400 mb-12 max-w-xl mx-auto">
        Semua yang kamu butuhkan untuk tetap aman dan siap menghadapi bencana
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {features.map((feature, i) => (
          <div
            key={feature.id}
            className="p-6 bg-white/[0.04] border border-white/10 rounded-2xl hover:bg-white/[0.07] hover:border-indigo-500/30 transition-all duration-200 group"
          >
            <div className="text-3xl mb-3">{featureIcons[i]}</div>
            <h3 className="font-semibold text-lg mb-2 text-slate-100 group-hover:text-indigo-300 transition-colors">
              {feature.title}
            </h3>
            <p className="text-sm text-slate-400">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
