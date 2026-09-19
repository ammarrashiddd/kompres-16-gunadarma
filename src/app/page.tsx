import Navbar from "@/components/navbar/page";

export default function HomePage() {
  return (
    <main className="relative min-h-dvh flex items-center justify-center px-6 py-12 overflow-hidden">
      {/* Background animated blobs */}
      <div className="fixed -top-28 -left-24 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,#6366f1,transparent)] opacity-35 blur-[80px] pointer-events-none animate-[blobFloat_8s_ease-in-out_infinite]" aria-hidden="true" />
      <div className="fixed -bottom-20 -right-20 w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,#a855f7,transparent)] opacity-35 blur-[80px] pointer-events-none animate-[blobFloat_8s_ease-in-out_infinite_-3s]" aria-hidden="true" />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-[radial-gradient(circle,#06b6d4,transparent)] opacity-[0.18] blur-[80px] pointer-events-none animate-[blobFloat_8s_ease-in-out_infinite_-6s]" aria-hidden="true" />

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 md:px-12">
        <Navbar />
      </nav>

      {/* Landing Content */}
      <div className="relative z-10 text-center max-w-[680px] w-full animate-[cardIn_0.6s_cubic-bezier(0.16,1,0.3,1)_both]">
        {/* Hero */}
        <div>
          <div className="inline-block px-4 py-1.5 mb-7 bg-indigo-500/15 border border-indigo-500/30 rounded-full text-[13px] font-semibold text-indigo-400 tracking-wide">
            🔐 Sistem Autentikasi JWT
          </div>
          <h1 className="text-[clamp(36px,6vw,64px)] font-extrabold tracking-[-0.04em] leading-[1.1] text-slate-100 mb-5">
            Keamanan Akun yang
            <br />
            <span className="bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
              Andal &amp; Modern
            </span>
          </h1>
          <p className="text-[17px] text-slate-400 leading-[1.7] max-w-[520px] mx-auto mb-10">
            Sistem autentikasi berbasis JSON Web Token dengan enkripsi bcrypt.
            Daftar dan masuk dengan aman ke platform kami.
          </p>

          {/* Features */}
          <div className="flex items-center justify-center gap-6 flex-wrap mb-11">
            <div className="flex items-center gap-2 text-[13.5px] font-medium text-slate-400 px-4 py-2 bg-white/[0.04] border border-white/10 rounded-full backdrop-blur-sm">
              <span className="text-base">🛡️</span>
              <span>Password terenkripsi bcrypt</span>
            </div>
            <div className="flex items-center gap-2 text-[13.5px] font-medium text-slate-400 px-4 py-2 bg-white/[0.04] border border-white/10 rounded-full backdrop-blur-sm">
              <span className="text-base">⚡</span>
              <span>JWT dengan expiry 7 hari</span>
            </div>
            <div className="flex items-center gap-2 text-[13.5px] font-medium text-slate-400 px-4 py-2 bg-white/[0.04] border border-white/10 rounded-full backdrop-blur-sm">
              <span className="text-base">🗄️</span>
              <span>Database PostgreSQL</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
