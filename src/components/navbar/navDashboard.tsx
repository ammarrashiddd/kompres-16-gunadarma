"use client";

import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

export default function NavDashboard() {
  const router = useRouter();

  async function handleLogout() {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    // Hapus cookie auth agar middleware redirect ke login
    document.cookie = "auth_token=; path=/; max-age=0; SameSite=Lax";
    try {
      await signOut({ redirect: false });
    } catch {
      // ignore
    }
    router.push("/login");
  }

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={handleLogout}
        className="rounded-full border border-[#e5e5ea] bg-white px-4 py-2 text-sm font-medium text-[#1d1d1f] transition-all duration-150 hover:bg-[#f7f7f8]"
      >
        Keluar
      </button>
    </div>
  );
}
