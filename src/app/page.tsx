"use client";

import {
  ActivityIcon as Activity,
  ArrowRight,
  Brain,
  CaretRight,
  ChatCircleDots,
  CheckCircle,
  Database,
  Funnel,
  MapPinLine,
  MapTrifold,
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

        <section className="grid items-center gap-12 pb-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20 lg:pb-28">
          <div className="max-w-2xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#dfd6cf] bg-[#f0e5dd] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#a15d3c]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#c85b31]" />
              Indonesia siap siaga
            </div>
            <h1 className="max-w-xl text-[clamp(2.8rem,6vw,5.8rem)] font-semibold leading-[0.95] tracking-[-0.09em] text-[#202123]">
              Data yang rumit, jadi langkah yang jelas.
            </h1>
            <p className="mt-7 max-w-lg text-base leading-7 text-[#6f6d69] md:text-lg">
              SIGAP mengubah informasi gempa menjadi pemahaman yang bisa dipakai
              siapa saja untuk bersiap, saling membantu, dan bertindak.
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
            <a
              href="#cara-kerja"
              className="mt-8 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#a15d3c] transition-colors hover:text-[#202123]"
            >
              Lihat cara kerja <CaretRight size={14} weight="bold" />
            </a>
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

        <section
          className="border-t border-[#e5e1dc] py-20 md:py-28"
          id="fitur"
        >
          <div className="max-w-2xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#a15d3c]">
              Tiga alat dalam satu tempat
            </p>
            <h2 className="mt-4 max-w-xl text-4xl font-semibold leading-[1.02] tracking-[-0.07em] md:text-6xl">
              Dari tahu, menjadi siap.
            </h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-[#777572]">
              Setiap fitur punya peran sederhana. Anda tidak perlu menjadi ahli
              data untuk menggunakannya.
            </p>
          </div>

          <div className="mt-12 grid gap-4 lg:grid-cols-3">
            <article className="group rounded-[24px] bg-[#202123] p-6 text-white transition-transform hover:-translate-y-1 md:p-8">
              <div className="flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#df8e67] text-[#202123]">
                  <MapTrifold size={25} weight="duotone" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/45">
                  01 / Pantau
                </span>
              </div>
              <h3 className="mt-16 text-2xl font-semibold tracking-[-0.05em]">
                Dashboard gempa
              </h3>
              <p className="mt-3 text-sm leading-6 text-white/65">
                Peta hidup yang menunjukkan gempa terbaru, lokasi, kedalaman,
                dan magnitudonya dalam satu pandangan.
              </p>
              <div className="mt-8 flex items-center gap-2 text-xs font-semibold text-[#df8e67]">
                Lihat apa yang terjadi <ArrowRight size={15} weight="bold" />
              </div>
            </article>

            <article className="rounded-[24px] border border-[#dedbd5] bg-[#ece9e5] p-6 transition-transform hover:-translate-y-1 md:p-8">
              <div className="flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#dceadf] text-[#3b7045]">
                  <Brain size={25} weight="duotone" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#a15d3c]">
                  02 / Pahami
                </span>
              </div>
              <h3 className="mt-16 text-2xl font-semibold tracking-[-0.05em]">
                Analisis machine learning
              </h3>
              <p className="mt-3 text-sm leading-6 text-[#777572]">
                Sistem membaca pola data historis untuk memberi gambaran risiko
                lokasi Anda, bukan meramal kapan gempa terjadi.
              </p>
              <div className="mt-8 flex items-center gap-2 text-xs font-semibold text-[#3b7045]">
                Kenali kondisi lokasi <ArrowRight size={15} weight="bold" />
              </div>
            </article>

            <article className="rounded-[24px] border border-[#dfd6cf] bg-[#f0e5dd] p-6 transition-transform hover:-translate-y-1 md:p-8">
              <div className="flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fff7ef] text-[#a15d3c]">
                  <ChatCircleDots size={25} weight="duotone" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#a15d3c]">
                  03 / Bertindak
                </span>
              </div>
              <h3 className="mt-16 text-2xl font-semibold tracking-[-0.05em]">
                Community &amp; assistant
              </h3>
              <p className="mt-3 text-sm leading-6 text-[#777572]">
                Bagikan laporan dari sekitar dan dapatkan panduan evakuasi yang
                menyesuaikan situasi Anda, dengan keselamatan sebagai prioritas.
              </p>
              <div className="mt-8 flex items-center gap-2 text-xs font-semibold text-[#a15d3c]">
                Ambil langkah berikutnya <ArrowRight size={15} weight="bold" />
              </div>
            </article>
          </div>
        </section>

        <section
          className="border-t border-[#e5e1dc] py-20 md:py-28"
          id="cara-kerja"
        >
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#a15d3c]">
                Cara kerja SIGAP
              </p>
              <h2 className="mt-4 max-w-md text-4xl font-semibold leading-[1.02] tracking-[-0.07em] md:text-5xl">
                Data tidak berhenti di angka.
              </h2>
              <p className="mt-5 max-w-md text-base leading-7 text-[#777572]">
                Kami menyederhanakan perjalanan dari data mentah sampai
                informasi yang bisa membantu Anda mengambil keputusan.
              </p>
            </div>

            <div className="relative space-y-3">
              <div className="absolute bottom-8 left-6 top-8 w-px bg-[#d7c9bf]" />
              <div className="relative flex gap-5 rounded-[20px] border border-[#dedbd5] bg-white p-5 md:p-6">
                <div className="z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#202123] text-white">
                  <Database size={22} weight="duotone" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#a15d3c]">
                    01 / Kumpulkan
                  </p>
                  <h3 className="mt-2 text-lg font-semibold">Data masuk</h3>
                  <p className="mt-1 text-sm leading-6 text-[#777572]">
                    Informasi gempa publik dan laporan warga dikumpulkan di satu
                    tempat.
                  </p>
                </div>
              </div>
              <div className="relative flex gap-5 rounded-[20px] border border-[#dedbd5] bg-white p-5 md:p-6">
                <div className="z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#f0e5dd] text-[#a15d3c]">
                  <Funnel size={22} weight="duotone" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#a15d3c]">
                    02 / Olah
                  </p>
                  <h3 className="mt-2 text-lg font-semibold">Data dirapikan</h3>
                  <p className="mt-1 text-sm leading-6 text-[#777572]">
                    Lokasi, waktu, magnitudo, dan pola historis disusun agar
                    dapat dibandingkan.
                  </p>
                </div>
              </div>
              <div className="relative flex gap-5 rounded-[20px] border border-[#dedbd5] bg-white p-5 md:p-6">
                <div className="z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#dceadf] text-[#3b7045]">
                  <Brain size={22} weight="duotone" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#a15d3c]">
                    03 / Pelajari
                  </p>
                  <h3 className="mt-2 text-lg font-semibold">
                    Model mencari pola
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-[#777572]">
                    Machine learning membantu memberi konteks risiko dari data
                    yang sudah diolah.
                  </p>
                </div>
              </div>
              <div className="relative flex gap-5 rounded-[20px] border border-[#dedbd5] bg-[#202123] p-5 text-white md:p-6">
                <div className="z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#df8e67] text-[#202123]">
                  <CheckCircle size={22} weight="duotone" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#df8e67]">
                    04 / Sampaikan
                  </p>
                  <h3 className="mt-2 text-lg font-semibold">Jadi tindakan</h3>
                  <p className="mt-1 text-sm leading-6 text-white/65">
                    Hasilnya hadir sebagai peta, ringkasan risiko, laporan
                    komunitas, dan panduan evakuasi.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-8 border-t border-[#e5e1dc] py-20 md:py-28 lg:grid-cols-[1fr_0.85fr] lg:items-end">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#a15d3c]">
              Untuk semua orang
            </p>
            <h2 className="mt-4 max-w-2xl text-4xl font-semibold leading-[1.02] tracking-[-0.07em] md:text-6xl">
              Kesiapsiagaan dimulai dari satu keputusan kecil.
            </h2>
          </div>
          <div className="lg:pb-1">
            <p className="max-w-md text-base leading-7 text-[#777572]">
              Mulai dengan melihat kondisi sekitar Anda. Saat informasi lebih
              mudah dipahami, langkah berikutnya terasa lebih dekat.
            </p>
            <Link
              href={isLoggedIn ? "/dashboard" : "/register"}
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#202123] px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-[#38393a] active:scale-[0.98]"
            >
              {isLoggedIn ? "Buka Dashboard" : "Mulai dengan SIGAP"}{" "}
              <ArrowRight size={17} weight="bold" />
            </Link>
          </div>
        </section>

        <footer className="flex flex-col gap-3 border-t border-[#e5e1dc] py-8 text-xs text-[#777572] md:flex-row md:items-center md:justify-between">
          <span className="font-semibold text-[#202123]">
            SIGAP / Kesiapsiagaan gempa Indonesia
          </span>
          <span>
            Estimasi risiko adalah informasi statistik, bukan prediksi gempa.
          </span>
        </footer>
      </div>
    </main>
  );
}
