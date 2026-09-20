import Link from "next/link";

export default function CTASection(): React.JSX.Element {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 pointer-events-none" />
      <div className="relative container mx-auto px-4 text-center max-w-3xl">
        <h2 className="text-3xl font-bold mb-4 text-slate-100">
          Lindungi Diri dan Keluarga dengan Fitur Cerdas Kami
        </h2>
        <p className="text-slate-400 mb-10 max-w-xl mx-auto leading-relaxed">
          Dapatkan akses ke analisis risiko presisi, asisten evakuasi AI, dan
          peta safe zone secara real-time hanya dengan mendaftar.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold rounded-xl hover:opacity-90 hover:-translate-y-px transition-all duration-150 shadow-lg shadow-indigo-500/30"
          >
            Daftar Sekarang — Gratis
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center px-8 py-3.5 text-slate-300 font-medium border border-white/10 rounded-xl hover:bg-white/[0.05] hover:text-white transition-all duration-150"
          >
            Sudah punya akun? Masuk
          </Link>
        </div>
      </div>
    </section>
  );
}
