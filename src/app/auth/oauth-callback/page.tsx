"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function OAuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (!token) {
      router.replace("/login?oauth_error=Token login tidak ditemukan");
      return;
    }

    localStorage.setItem("auth_token", token);
    document.cookie = `auth_token=${encodeURIComponent(token)}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
    router.replace("/dashboard");
  }, [router]);

  return (
    <main className="auth-shell flex min-h-dvh items-center justify-center px-4 text-sm text-white/60">
      Menyelesaikan login...
    </main>
  );
}
