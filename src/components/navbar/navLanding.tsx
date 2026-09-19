import Link from "next/link";

export default function NavLanding() {
  return (
    <div className="flex items-center gap-3">
      <Link
        href="/login"
        className="px-4 py-2 text-sm font-medium text-white/70 hover:text-white transition-colors duration-150"
      >
        Masuk
      </Link>
      <Link
        href="/register"
        className="px-5 py-2 text-sm font-semibold text-white rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:opacity-90 hover:scale-105 transition-all duration-150 shadow-lg shadow-indigo-500/30"
      >
        Daftar
      </Link>
    </div>
  );
}
