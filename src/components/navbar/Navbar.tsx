"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import NavDashboard from "./navDashboard";
import NavLanding from "./navLanding";

export default function Navbar() {
  const pathname = usePathname();

  const isWorkspace = [
    "/dashboard",
    "/community",
    "/evacuation-assistant",
    "/profile",
  ].some((route) => pathname.startsWith(route));

  return (
    <header className="flex w-full items-center justify-between border-b border-[#e5e3df] pb-4">
      <Link
        href="/"
        className="select-none text-2xl font-semibold tracking-[-0.08em] text-[#202123] transition-opacity hover:opacity-70 md:text-[2.1rem]"
      >
        <span className="text-[#c85b31]">●</span> GTek
      </Link>

      <div className="flex items-center gap-2 md:gap-3">
        {isWorkspace && (
          <>
            <nav
              aria-label="Navigasi utama"
              className="hidden items-center gap-1 sm:flex"
            >
              {[
                { href: "/dashboard", label: "Dashboard" },
                { href: "/community", label: "Komunitas" },
                { href: "/evacuation-assistant", label: "Asisten evakuasi" },
              ].map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  aria-current={pathname.startsWith(href) ? "page" : undefined}
                  className={`rounded-full px-3 py-2 text-xs font-medium transition-colors ${
                    pathname.startsWith(href)
                      ? "bg-[#202123] text-white"
                      : "text-[#6f6d69] hover:bg-[#eeece8] hover:text-[#202123]"
                  }`}
                >
                  {label}
                </Link>
              ))}
            </nav>
            <details className="relative sm:hidden">
              <summary className="cursor-pointer list-none rounded-full border border-[#e5e3df] px-3 py-2 text-xs font-semibold text-[#6f6d69]">
                Menu
              </summary>
              <nav
                aria-label="Navigasi utama"
                className="absolute right-0 z-20 mt-2 flex min-w-44 flex-col rounded-xl border border-[#e5e3df] bg-white p-1.5 shadow-lg"
              >
                {[
                  { href: "/dashboard", label: "Dashboard" },
                  { href: "/community", label: "Komunitas" },
                  { href: "/evacuation-assistant", label: "Asisten evakuasi" },
                ].map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    aria-current={
                      pathname.startsWith(href) ? "page" : undefined
                    }
                    className={`rounded-lg px-3 py-2.5 text-xs font-medium ${
                      pathname.startsWith(href)
                        ? "bg-[#f1e5df] text-[#a44b29]"
                        : "text-[#6f6d69] hover:bg-[#f6f5f3]"
                    }`}
                  >
                    {label}
                  </Link>
                ))}
              </nav>
            </details>
          </>
        )}
        {isWorkspace ? <NavDashboard /> : <NavLanding />}
      </div>
    </header>
  );
}
