"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import AuthForm from "@/components/auth/AuthForm";
import InputField from "@/components/InputField";

interface FieldErrors {
  nama?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export default function RegisterPage() {
  const router = useRouter();

  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  function validateForm(): boolean {
    const errors: FieldErrors = {};
    if (nama.trim().length < 2) errors.nama = "Nama minimal 2 karakter.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Format email tidak valid.";
    if (password.length < 8) errors.password = "Password minimal 8 karakter.";
    if (password !== confirmPassword) errors.confirmPassword = "Konfirmasi password tidak cocok.";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!validateForm()) return;
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nama, email, password, confirmPassword }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message ?? "Registrasi gagal. Coba lagi.");
        return;
      }

      setSuccess("Akun berhasil dibuat! Mengarahkan ke halaman login...");
      setTimeout(() => router.push("/login"), 1500);
    } catch {
      setError("Tidak dapat terhubung ke server. Periksa koneksi Anda.");
    } finally {
      setIsLoading(false);
    }
  }

  const strengthLevel =
    password.length === 0 ? null
    : password.length < 8 ? "weak"
    : password.length < 12 ? "medium"
    : "strong";

  return (
    <AuthForm
      title="Buat Akun Baru"
      subtitle="Bergabung dan mulai pengalaman Anda"
      onSubmit={handleSubmit}
      submitLabel="Daftar Sekarang"
      isLoading={isLoading}
      error={error}
      success={success}
      footerText="Sudah punya akun?"
      footerLinkText="Masuk di sini"
      footerLinkHref="/login"
    >
      {/* Nama */}
      <InputField
        id="nama"
        label="Nama Lengkap"
        type="text"
        value={nama}
        onChange={(v) => { setNama(v); setFieldErrors((p) => ({ ...p, nama: undefined })); }}
        placeholder="Masukkan nama lengkap"
        autoComplete="name"
        required
        error={fieldErrors.nama}
        icon={
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        }
      />

      {/* Email */}
      <InputField
        id="email"
        label="Alamat Email"
        type="email"
        value={email}
        onChange={(v) => { setEmail(v); setFieldErrors((p) => ({ ...p, email: undefined })); }}
        placeholder="contoh@email.com"
        autoComplete="email"
        required
        error={fieldErrors.email}
        icon={
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
          </svg>
        }
      />

      {/* Password */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="reg-password" className="text-xs font-semibold text-[#6e6e73] uppercase tracking-wide">
          Password
        </label>
        <div className={`relative flex items-center bg-[#f5f5f7] border rounded-xl transition-all duration-150 focus-within:border-[#202123] focus-within:bg-white focus-within:shadow-[0_0_0_3px_rgba(32,33,35,0.08)] ${fieldErrors.password ? "border-red-400" : "border-[#e5e5ea]"}`}>
          <span className="flex items-center pl-3.5 text-[#6e6e73] flex-shrink-0">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </span>
          <input
            id="reg-password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => { setPassword(e.target.value); setFieldErrors((p) => ({ ...p, password: undefined })); }}
            placeholder="Minimal 8 karakter"
            required
            autoComplete="new-password"
            className="flex-1 py-3 px-3 bg-transparent border-none outline-none text-[#202123] text-[15px] font-[inherit] caret-[#202123] placeholder:text-[#6e6e73]/60"
          />
          <button
            type="button"
            onClick={() => setShowPassword((p) => !p)}
            aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
            className="flex items-center justify-center px-3.5 bg-transparent border-none cursor-pointer text-[#6e6e73] hover:text-[#202123] transition-colors duration-150 flex-shrink-0"
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
        {fieldErrors.password && <p className="text-[12.5px] text-red-600 font-medium">{fieldErrors.password}</p>}

        {/* Password Strength */}
        {strengthLevel && (
          <div className="flex items-center gap-2.5 mt-1">
            <div className="flex-1 h-1 bg-[#e5e5ea] rounded-full overflow-hidden">
              <div className={`h-full rounded-full transition-all duration-300 ${strengthLevel === "weak" ? "w-1/3 bg-red-500" : strengthLevel === "medium" ? "w-2/3 bg-amber-400" : "w-full bg-green-500"}`} />
            </div>
            <span className="text-xs font-semibold text-[#6e6e73] min-w-[48px] text-right">
              {strengthLevel === "weak" ? "Lemah" : strengthLevel === "medium" ? "Sedang" : "Kuat"}
            </span>
          </div>
        )}
      </div>

      {/* Confirm Password */}
      <InputField
        id="confirm-password"
        label="Konfirmasi Password"
        type={showPassword ? "text" : "password"}
        value={confirmPassword}
        onChange={(v) => { setConfirmPassword(v); setFieldErrors((p) => ({ ...p, confirmPassword: undefined })); }}
        placeholder="Ulangi password"
        autoComplete="new-password"
        required
        error={fieldErrors.confirmPassword}
        icon={
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        }
      />
    </AuthForm>
  );
}
