"use client";

import {
  ActivityIcon as Activity,
  ArrowRight,
  MapPinLine,
  ShieldCheck,
} from "@phosphor-icons/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import Navbar from "@/components/navbar/Navbar";

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const localToken = localStorage.getItem("auth_token");
    if (localToken) {
      setIsLoggedIn(true);
      return;
    }

    const cookies = document.cookie;
    if (
      cookies.includes("auth_token=") ||
      cookies.includes("authjs.session-token") ||
      cookies.includes("next-auth.session-token")
    ) {
      setIsLoggedIn(true);
    }

    fetch("/api/auth/session")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) setIsLoggedIn(true);
      })
      .catch(() => {});
  }, []);

  return (
    <main className="min-h-screen overflow-hidden bg-[#e9e7e5] px-3 py-3 text-[#202123] md:px-6 md:py-6 lg:px-8">
      <div className="mx-auto max-w-360 rounded-[30px] bg-[#f7f7f5] px-4 py-4 shadow-[0_24px_70px_rgba(48,43,38,0.12)] md:px-8 md:py-6">
        <nav className="mb-16">
          <Navbar />
        </nav>

        <section className="grid items-center gap-12 pb-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20 lg:pb-24">
          <div className="max-w-2xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#dfd6cf] bg-[#f0e5dd] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#a15d3c]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#c85b31]" />
              Indonesia siap siaga
            </div>
            <h1 className="max-w-xl text-[clamp(2.8rem,6vw,5.8rem)] font-semibold leading-[0.95] tracking-[-0.09em] text-[#202123]">
              Lebih siap menghadapi yang tak terduga.
            </h1>
            <p className="mt-7 max-w-lg text-base leading-7 text-[#6f6d69] md:text-lg">
              SIGAP membantu Anda membaca aktivitas gempa, memahami risiko
              lokasi, dan mengambil langkah evakuasi yang tepat.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link
                href={isLoggedIn ? "/dashboard" : "/register"}
                className="inline-flex items-center gap-2 rounded-full bg-[#202123] px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-[#38393a] active:scale-[0.98]"
              >
                {isLoggedIn ? "Buka Dashboard" : "Mulai dengan SIGAP"}{" "}
                <ArrowRight size={17} weight="bold" />
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-xs text-[#777572]">
              <span className="inline-flex items-center gap-2">
                <Activity size={15} className="text-[#a15d3c]" /> Data gempa
                aktif
              </span>
              <span className="inline-flex items-center gap-2">
                <ShieldCheck size={15} className="text-[#4d8a56]" /> Panduan
                berbasis keselamatan
              </span>
            </div>
          </div>

          <div className="relative min-h-107.5 overflow-hidden rounded-[26px] border border-[#dedbd5] bg-[#ece9e5] p-4 shadow-[0_16px_35px_rgba(48,43,38,0.07)] md:p-6">
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full border border-[#d7c9bf]" />
            <div className="absolute -bottom-28 -left-20 h-72 w-72 rounded-full border border-[#d7c9bf]" />
            <div className="relative flex h-full flex-col justify-between">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#a15d3c]">
                    Live signal
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-[-0.06em]">
                    Indonesia hari ini
                  </h2>
                </div>
                <span className="rounded-full bg-[#e8f2e8] px-3 py-1.5 text-[10px] font-semibold text-[#3b7045]">
                  Terpantau
                </span>
              </div>

              <div className="relative mx-auto flex aspect-square w-[78%] items-center justify-center rounded-full border border-[#d7c9bf] bg-[#f5f1ed]">
                <div className="absolute h-[72%] w-[72%] rounded-full border border-[#d7c9bf]" />
                <div className="absolute h-[43%] w-[43%] rounded-full border border-[#d7c9bf]" />
                <div className="relative flex h-28 w-28 flex-col items-center justify-center rounded-full bg-[#202123] text-white shadow-[0_12px_28px_rgba(32,33,35,0.2)]">
                  <MapPinLine
                    size={25}
                    weight="fill"
                    className="text-[#df8e67]"
                  />
                  <span className="mt-1 text-[10px] uppercase tracking-[0.16em] text-white/60">
                    Indonesia
                  </span>
                </div>
                <span className="absolute left-[16%] top-[28%] h-3 w-3 rounded-full bg-[#c85b31] shadow-[0_0_0_7px_rgba(200,91,49,0.12)]" />
                <span className="absolute right-[18%] top-[46%] h-2.5 w-2.5 rounded-full bg-[#c85b31] shadow-[0_0_0_7px_rgba(200,91,49,0.12)]" />
                <span className="absolute bottom-[20%] left-[31%] h-2.5 w-2.5 rounded-full bg-[#d9a84f]" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-white/75 p-3">
                  <p className="text-[10px] uppercase tracking-[0.12em] text-[#8a8783]">
                    Aktivitas
                  </p>
                  <p className="mt-1 text-xl font-semibold tracking-[-0.06em]">
                    14
                  </p>
                  <p className="text-[11px] text-[#777572]">
                    kejadian terpantau
                  </p>
                </div>
                <div className="rounded-2xl bg-white/75 p-3">
                  <p className="text-[10px] uppercase tracking-[0.12em] text-[#8a8783]">
                    Fokus utama
                  </p>
                  <p className="mt-1 text-xl font-semibold tracking-[-0.06em]">
                    M 6.0
                  </p>
                  <p className="text-[11px] text-[#777572]">
                    magnitudo tertinggi
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 border-t border-[#e5e1dc] pt-8 md:grid-cols-3 md:gap-6">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#a15d3c]">
              01 / Pantau
            </p>
            <h3 className="mt-3 text-xl font-semibold tracking-tighter">
              Lihat data gempa real-time
            </h3>
            <p className="mt-2 text-sm leading-6 text-[#777572]">
              Peta interaktif untuk memahami apa yang terjadi di sekitar
              Indonesia.
            </p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#a15d3c]">
              02 / Pahami
            </p>
            <h3 className="mt-3 text-xl font-semibold tracking-tighter">
              Kenali risiko lokasi Anda
            </h3>
            <p className="mt-2 text-sm leading-6 text-[#777572]">
              Analisis ringkas yang membantu Anda menyiapkan keputusan lebih
              baik.
            </p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#a15d3c]">
              03 / Bertindak
            </p>
            <h3 className="mt-3 text-xl font-semibold tracking-tighter">
              Ikuti panduan evakuasi
            </h3>
            <p className="mt-2 text-sm leading-6 text-[#777572]">
              Prioritaskan keselamatan dengan langkah yang jelas dan mudah
              diikuti.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

