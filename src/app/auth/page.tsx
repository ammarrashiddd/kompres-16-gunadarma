"use client";

import { Suspense, useState, type FormEvent } from "react";
import { ArrowLeft } from "@phosphor-icons/react";
import { useRouter, useSearchParams } from "next/navigation";

function AuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");
  const isLogin = mode !== "signup";

  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSetMode = (newMode: "signin" | "signup") => {
    router.push(`/auth?mode=${newMode}`);
    setError(null);
  };

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
      const body = isLogin ? { email, password } : { nama, email, password, confirmPassword: password };
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.message ?? "Terjadi kesalahan.");
        return;
      }
      if (isLogin) {
        localStorage.setItem("auth_token", data.token);
        localStorage.setItem("auth_user", JSON.stringify(data.data));
        router.push("/dashboard");
      } else {
        router.push("/auth?mode=signin");
      }
    } catch {
      setError("Tidak dapat terhubung ke server.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen w-full bg-white overflow-x-hidden md:max-h-screen">
      {/* Image Panel — Hidden on mobile */}
      <div className="hidden lg:flex flex-1 px-6 py-6 md:px-10">
        <img
          src="/assets/images/5.jpg"
          alt="Auth Image"
          className="rounded-3xl w-full h-full object-cover shadow-2xl"
        />
      </div>

      {/* Form Section */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 lg:p-20">
        <div className="w-full max-w-sm md:max-w-md">
          <button
            onClick={() => router.push("/")}
            className="font-black text-[#202123] hover:opacity-70 hover:cursor-pointer text-base md:text-lg flex flex-row items-center gap-2 mb-8 md:mb-10 transition-all duration-150 group"
          >
            <ArrowLeft size={24} weight="bold" className="group-hover:-translate-x-1 transition-transform" />
            Back
          </button>

          {/* Title */}
          <h1 className="text-2xl font-bold tracking-tight text-[#202123] mb-1.5">
            {isLogin ? "Selamat Datang Kembali" : "Buat Akun Baru"}
          </h1>
          <p className="text-sm text-[#6e6e73] mb-7">
            {isLogin ? "Masuk ke akun Anda untuk melanjutkan." : "Bergabung dan mulai pengalaman Anda."}
          </p>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2.5 px-4 py-3 mb-5 rounded-xl text-[13.5px] font-medium text-red-700 bg-[#fce4e4] border border-red-200" role="alert">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
            {!isLogin && (
              <div className="flex flex-col gap-1.5">
                <label htmlFor="nama" className="text-xs font-semibold text-[#6e6e73] uppercase tracking-wide">Nama Lengkap</label>
                <input
                  id="nama"
                  type="text"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  placeholder="Masukkan nama lengkap"
                  required
                  autoComplete="name"
                  className="w-full py-3 px-4 bg-[#f5f5f7] border border-[#e5e5ea] rounded-xl text-[#202123] text-[15px] outline-none transition-all duration-150 focus:border-[#202123] focus:bg-white focus:shadow-[0_0_0_3px_rgba(32,33,35,0.08)] placeholder:text-[#6e6e73]/60"
                />
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-xs font-semibold text-[#6e6e73] uppercase tracking-wide">Alamat Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="contoh@email.com"
                required
                autoComplete="email"
                className="w-full py-3 px-4 bg-[#f5f5f7] border border-[#e5e5ea] rounded-xl text-[#202123] text-[15px] outline-none transition-all duration-150 focus:border-[#202123] focus:bg-white focus:shadow-[0_0_0_3px_rgba(32,33,35,0.08)] placeholder:text-[#6e6e73]/60"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-xs font-semibold text-[#6e6e73] uppercase tracking-wide">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimal 8 karakter"
                required
                autoComplete={isLogin ? "current-password" : "new-password"}
                className="w-full py-3 px-4 bg-[#f5f5f7] border border-[#e5e5ea] rounded-xl text-[#202123] text-[15px] outline-none transition-all duration-150 focus:border-[#202123] focus:bg-white focus:shadow-[0_0_0_3px_rgba(32,33,35,0.08)] placeholder:text-[#6e6e73]/60"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-6 bg-[#202123] text-white text-[15px] font-semibold rounded-xl hover:bg-[#38393a] active:scale-[0.98] transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? "Memproses..." : isLogin ? "Masuk" : "Daftar Sekarang"}
            </button>
          </form>

          {/* Switch Mode */}
          <p className="text-center mt-8 text-sm font-medium text-[#6e6e73]">
            {isLogin ? "Belum punya akun?" : "Sudah punya akun?"}{" "}
            <button
              onClick={() => handleSetMode(isLogin ? "signup" : "signin")}
              className="text-[#202123] underline underline-offset-4 hover:opacity-70 transition-all font-bold"
            >
              {isLogin ? "Daftar" : "Masuk"}
            </button>
          </p>
        </div>
      </div>
    </main>
  );
}

export default function AuthPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen w-full items-center justify-center bg-white">
          <p className="text-[#6e6e73]">Loading...</p>
        </main>
      }
    >
      <AuthContent />
    </Suspense>
  );
}
