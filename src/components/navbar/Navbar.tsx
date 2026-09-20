"use client";

import { usePathname, useRouter } from "next/navigation";
import NavDashboard from "./navDashboard";
import NavLanding from "./navLanding";

export default function Navbar() {
  const Router = useRouter();
  const pathname = usePathname();

  const isDashboard = pathname.startsWith("/dashboard");

  return (
    <header className="flex w-full items-center justify-between border-b border-[#e5e3df] pb-4">
      <h1
        onClick={() => Router.push("/")}
        className="cursor-pointer select-none text-2xl font-semibold tracking-[-0.08em] text-[#202123] transition-opacity hover:opacity-70 md:text-[2.1rem]"
      >
        <span className="text-[#c85b31]">●</span> SIGAP
      </h1>

      <div className="flex items-center gap-2 md:gap-3">
        {isDashboard ? <NavDashboard /> : <NavLanding />}
      </div>
    </header>
  );
}
