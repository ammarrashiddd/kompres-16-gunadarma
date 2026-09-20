import Link from "next/link";

export default function NavLanding() {
  return (
    <div className="flex items-center gap-2">
      <Link
        href="/login"
        className="rounded-full px-4 py-2 text-sm font-medium text-[#6f6d69] transition-colors duration-150 hover:text-[#202123]"
      >
        Masuk
      </Link>
      <Link
        href="/register"
        className="rounded-full bg-[#202123] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_6px_16px_rgba(32,33,35,0.12)] transition-all duration-150 hover:bg-[#38393a] active:scale-[0.98]"
      >
        Daftar
      </Link>
    </div>
  );
}
