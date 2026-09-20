export default function Footer(): React.JSX.Element {
  return (
    <footer className="border-t border-white/10 bg-black/20 backdrop-blur-sm py-12">
      <div className="container mx-auto px-4 max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-white font-bold text-lg mb-3">
            <span className="bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
              GTEK
            </span>
          </h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Gunadarma Tremor &amp; Earthquake Knowledge — platform informasi
            gempa terkini, analisis risiko, dan panduan evakuasi berbasis AI
            untuk masyarakat Indonesia.
          </p>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3">Sumber Data</h4>
          <ul className="text-sm text-slate-400 space-y-2">
            <li>BMKG — Data Gempa &amp; Cuaca</li>
            <li>BNPB / InaRISK — Data Risiko Bencana</li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3">Kontak</h4>
          <ul className="text-sm text-slate-400 space-y-2">
            <li>Email: info@gtek.id</li>
            <li>Instagram: @gtek.id</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/5 mt-10 pt-5 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} GTEK — Universitas Gunadarma. All rights reserved.
      </div>
    </footer>
  );
}
