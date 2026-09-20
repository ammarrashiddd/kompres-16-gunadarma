"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import AuthForm from "@/components/auth/AuthForm";
import InputField from "@/components/InputField";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message ?? "Login gagal. Coba lagi.");
        return;
      }

      // Simpan token JWT di localStorage dan cookie (untuk middleware)
      localStorage.setItem("auth_token", data.token);
      localStorage.setItem("auth_user", JSON.stringify(data.data));
      document.cookie = `auth_token=${data.token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;

      setSuccess("Login berhasil! Mengarahkan...");
      setTimeout(() => router.push("/dashboard"), 1000);
    } catch {
      setError("Tidak dapat terhubung ke server. Periksa koneksi Anda.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AuthForm
      title="Selamat Datang Kembali"
      subtitle="Masuk ke akun Anda untuk melanjutkan"
      onSubmit={handleSubmit}
      submitLabel="Masuk"
      isLoading={isLoading}
      error={error}
      success={success}
      footerText="Belum punya akun?"
      footerLinkText="Daftar sekarang"
      footerLinkHref="/register"
    >
      {/* Email */}
      <InputField
        id="email"
        label="Alamat Email"
        type="email"
        value={email}
        onChange={setEmail}
        placeholder="contoh@email.com"
        autoComplete="email"
        required
        icon={
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
          </svg>
        }
      />

      {/* Password */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-xs font-semibold text-[#6e6e73] uppercase tracking-wide">
          Password
        </label>
        <div className="relative flex items-center bg-[#f5f5f7] border border-[#e5e5ea] rounded-xl transition-all duration-150 focus-within:border-[#202123] focus-within:bg-white focus-within:shadow-[0_0_0_3px_rgba(32,33,35,0.08)]">
          <span className="flex items-center pl-3.5 text-[#6e6e73] flex-shrink-0">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </span>
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Minimal 8 karakter"
            required
            autoComplete="current-password"
            className="flex-1 py-3 px-3 bg-transparent border-none outline-none text-[#202123] text-[15px] font-[inherit] caret-[#202123] placeholder:text-[#6e6e73]/60"
          />
          <button
            type="button"
            className="flex items-center justify-center px-3.5 bg-transparent border-none cursor-pointer text-[#6e6e73] hover:text-[#202123] transition-colors duration-150 flex-shrink-0"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
          >
            {showPassword ? (
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            ) : (
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </AuthForm>
  );
}
