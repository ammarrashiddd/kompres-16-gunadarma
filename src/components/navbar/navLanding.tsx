"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

export default function NavLanding() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    // 1. Cek token lokal (custom JWT)
    const localToken = localStorage.getItem("auth_token");
    const localUser = localStorage.getItem("auth_user");
    if (localToken) {
      setIsLoggedIn(true);
      if (localUser) {
        try {
          const u = JSON.parse(localUser);
          setUserName(u.nama || u.name);
        } catch {}
      }
      return;
    }

    // 2. Cek session cookie (custom JWT atau NextAuth)
    const cookies = document.cookie;
    if (
      cookies.includes("auth_token=") ||
      cookies.includes("authjs.session-token") ||
      cookies.includes("next-auth.session-token")
    ) {
      setIsLoggedIn(true);
    }

    // 3. Cek NextAuth session (Google OAuth)
    fetch("/api/auth/session")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) {
          setIsLoggedIn(true);
          const name = data.user.name || data.user.email?.split("@")[0];
          setUserName(name);
          try {
            localStorage.setItem(
              "auth_user",
              JSON.stringify({
                nama: name,
                email: data.user.email,
                image: data.user.image,
              }),
            );
          } catch {}
        }
      })
      .catch(() => {});
  }, []);

  async function handleLogout() {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    document.cookie = "auth_token=; path=/; max-age=0; SameSite=Lax";
    try {
      await signOut({ redirect: false });
    } catch {}
    setIsLoggedIn(false);
    setUserName(null);
    router.refresh();
  }

  if (isLoggedIn) {
    return (
      <div className="flex items-center gap-2 md:gap-3">
        {userName && (
          <span className="hidden sm:inline-block text-xs font-semibold text-[#6f6d69]">
            Halo, {userName}
          </span>
        )}
        <Link
          href="/dashboard"
          className="rounded-full bg-[#202123] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_6px_16px_rgba(32,33,35,0.12)] transition-all duration-150 hover:bg-[#38393a] active:scale-[0.98]"
        >
          Dashboard
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          className="rounded-full border border-[#e5e3df] bg-white px-4 py-2 text-sm font-medium text-[#6f6d69] transition-all duration-150 hover:bg-[#f5f5f7] hover:text-[#202123] cursor-pointer"
        >
          Keluar
        </button>
      </div>
    );
  }

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
