"use client";

import { useRouter } from "next/navigation";

export default function NavDashboard() {
  const router = useRouter();

  function handleLogout() {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    router.push("/login");
  }

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={handleLogout}
        className="px-5 py-2 text-sm font-semibold text-white rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:opacity-90 hover:scale-105 transition-all duration-150 shadow-lg shadow-indigo-500/30"
      >
        Keluar
      </button>
    </div>
  );
}
