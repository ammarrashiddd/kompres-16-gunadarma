import Navbar from "@/components/navbar/Navbar";
import EarthquakeBanner from "@/components/EarthquakeBanner";
import FeatureShowcase from "@/components/FeatureShowcase";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

export default function Home(): React.JSX.Element {
  return (
    <main className="min-h-dvh relative overflow-x-hidden">
      {/* Background animated blobs */}
      <div className="fixed -top-28 -left-24 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,#6366f1,transparent)] opacity-25 blur-[80px] pointer-events-none animate-[blobFloat_8s_ease-in-out_infinite]" aria-hidden="true" />
      <div className="fixed -bottom-20 -right-20 w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,#a855f7,transparent)] opacity-25 blur-[80px] pointer-events-none animate-[blobFloat_8s_ease-in-out_infinite_-3s]" aria-hidden="true" />

      {/* Navbar */}
      <nav className="sticky top-0 z-50 px-6 py-4 md:px-12 backdrop-blur-md bg-black/20 border-b border-white/[0.06]">
        <Navbar />
      </nav>

      {/* Hero */}
      <section className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="text-center mb-10 animate-[cardIn_0.6s_cubic-bezier(0.16,1,0.3,1)_both]">
          <div className="inline-block px-4 py-1.5 mb-5 bg-indigo-500/15 border border-indigo-500/30 rounded-full text-[13px] font-semibold text-indigo-400 tracking-wide">
            🌏 Platform Kesiapsiagaan Gempa Indonesia
          </div>
          <h1 className="text-[clamp(32px,5vw,60px)] font-extrabold tracking-tight leading-[1.1] text-slate-100 mb-5">
            Gunadarma Tremor &amp;{" "}
            <span className="bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
              Earthquake Knowledge
            </span>
          </h1>
          <p className="text-[17px] text-slate-400 leading-relaxed max-w-2xl mx-auto mb-10">
            Pantau gempa terkini secara real-time, lalu daftar untuk mengakses
            fitur analisis risiko, asisten evakuasi AI, dan lainnya.
          </p>

          {/* Live Earthquake Banner */}
          <div className="max-w-xl mx-auto">
            <EarthquakeBanner />
          </div>
        </div>
      </section>

      {/* Feature Showcase */}
      <FeatureShowcase />

      {/* CTA */}
      <CTASection />

      {/* Footer */}
      <Footer />
    </main>
  );
}
