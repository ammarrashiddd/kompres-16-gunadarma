"use client";

import { useEffect, useState, useRef, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/navbar/Navbar";
import {
  ArrowLeft,
  Camera,
  CheckCircle,
  Eye,
  EyeSlash,
  Lock,
  ShieldCheck,
  Trash,
  User,
  WarningCircle,
} from "@phosphor-icons/react";

export default function ProfilePage() {
  const router = useRouter();

  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [isOAuth, setIsOAuth] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);

  const [isFetching, setIsFetching] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch("/api/user/profile");
        if (!res.ok) {
          if (res.status === 401) {
            router.push("/login?redirect=/profile");
            return;
          }
          throw new Error("Gagal memuat profil.");
        }

        const data = await res.json();
        if (data.success && data.data) {
          setNama(data.data.nama || "");
          setEmail(data.data.email || "");
          setAvatar(data.data.avatar || null);
          setIsOAuth(Boolean(data.data.isOAuth));
        }
      } catch (err) {
        console.error(err);
        setError("Gagal memuat informasi profil.");
      } finally {
        setIsFetching(false);
      }
    }

    loadProfile();
  }, [router]);

  function handleImageChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setError("Ukuran foto maksimal 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatar(reader.result as string);
      setError(null);
    };
    reader.readAsDataURL(file);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (nama.trim().length < 2) {
      setError("Nama lengkap minimal 2 karakter.");
      return;
    }

    if (newPassword) {
      if (newPassword.length < 8) {
        setError("Password baru minimal 8 karakter.");
        return;
      }
      if (newPassword !== confirmPassword) {
        setError("Konfirmasi password baru tidak cocok.");
        return;
      }
    }

    setIsLoading(true);

    try {
      const payload: Record<string, any> = {
        nama: nama.trim(),
        avatar: avatar,
      };

      if (newPassword) {
        payload.newPassword = newPassword;
        if (currentPassword) {
          payload.currentPassword = currentPassword;
        }
      }

      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || "Gagal memperbarui profil.");
        return;
      }

      // Update localStorage agar komponen navbar langsung sinkron
      try {
        const stored = localStorage.getItem("auth_user");
        const existing = stored ? JSON.parse(stored) : {};
        localStorage.setItem(
          "auth_user",
          JSON.stringify({
            ...existing,
            nama: data.data.nama,
            avatar: data.data.avatar,
          })
        );
      } catch {}

      setSuccess("Profil berhasil diperbarui!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch {
      setError("Tidak dapat terhubung ke server.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#e9e7e5] px-3 py-3 text-[#202123] md:px-6 md:py-6 lg:px-8">
      <div className="mx-auto max-w-360 rounded-[30px] bg-[#f7f7f5] p-4 shadow-[0_24px_70px_rgba(48,43,38,0.12)] md:p-6 lg:p-8">
        {/* Navbar */}
        <nav className="mb-8">
          <Navbar />
        </nav>

        {/* Header with Back Button */}
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <button
              type="button"
              onClick={() => router.push("/dashboard")}
              className="inline-flex items-center gap-2 text-xs font-semibold text-[#6f6d69] hover:text-[#202123] transition-colors mb-2 cursor-pointer group"
            >
              <ArrowLeft size={16} weight="bold" className="group-hover:-translate-x-1 transition-transform" />
              Kembali ke Dashboard
            </button>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#202123]">
              Pengaturan Profil
            </h1>
            <p className="text-xs md:text-sm text-[#6f6d69] mt-1">
              Kelola informasi akun, foto profil, dan keamanan akun Anda.
            </p>
          </div>
        </div>

        {isFetching ? (
          <div className="flex h-64 items-center justify-center text-sm text-[#6f6d69]">
            Memuat profil akun...
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6 items-start">
            {/* Left Card: Avatar & User Summary */}
            <div className="rounded-[24px] border border-[#dedbd5] bg-white p-6 shadow-sm flex flex-col items-center text-center">
              {/* Avatar Frame */}
              <div className="relative group mb-4">
                <div className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-[#f7f7f5] shadow-lg bg-[#202123] text-white flex items-center justify-center">
                  {avatar ? (
                    <img
                      src={avatar}
                      alt={nama}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-3xl font-bold">
                      {nama.charAt(0).toUpperCase() || "U"}
                    </span>
                  )}
                </div>

                {/* Hover button overlay */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 p-2.5 rounded-full bg-[#202123] text-white shadow-md hover:bg-[#38393a] transition-all cursor-pointer"
                  title="Ganti Foto"
                  aria-label="Ganti Foto"
                >
                  <Camera size={16} weight="bold" />
                </button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />

              <h2 className="text-lg font-bold text-[#202123] max-w-full truncate">
                {nama || "Pengguna"}
              </h2>
              <p className="text-xs text-[#6f6d69] truncate max-w-full mt-0.5">
                {email}
              </p>

              <div className="mt-4 flex flex-wrap gap-2 justify-center">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-[#e8f2e8] text-[#3b7045]">
                  <ShieldCheck size={14} weight="fill" />
                  {isOAuth ? "Akun Google" : "Akun Terverifikasi"}
                </span>
              </div>

              <div className="mt-6 w-full border-t border-[#f0ede9] pt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 py-2 px-3 text-xs font-semibold rounded-xl border border-[#dedbd5] bg-white hover:bg-[#f7f7f5] text-[#202123] transition-colors cursor-pointer"
                >
                  Unggah Foto
                </button>
                {avatar && (
                  <button
                    type="button"
                    onClick={() => setAvatar(null)}
                    className="py-2 px-3 text-xs font-semibold rounded-xl text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                    title="Hapus Foto"
                  >
                    <Trash size={16} />
                  </button>
                )}
              </div>
            </div>

            {/* Right Card: Form Fields */}
            <div className="space-y-6">
              {/* Alert Messages */}
              {error && (
                <div className="flex items-center gap-2.5 px-4 py-3 rounded-2xl text-xs md:text-sm font-medium text-red-700 bg-red-50 border border-red-200 animate-in fade-in">
                  <WarningCircle size={18} weight="fill" className="shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="flex items-center gap-2.5 px-4 py-3 rounded-2xl text-xs md:text-sm font-medium text-green-700 bg-green-50 border border-green-200 animate-in fade-in">
                  <CheckCircle size={18} weight="fill" className="shrink-0" />
                  <span>{success}</span>
                </div>
              )}

              {/* Section 1: Data Akun */}
              <div className="rounded-[24px] border border-[#dedbd5] bg-white p-6 shadow-sm space-y-5">
                <h3 className="text-base font-bold text-[#202123]">
                  Informasi Dasar
                </h3>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#6f6d69] uppercase tracking-wide">
                    Nama Lengkap
                  </label>
                  <div className="relative flex items-center bg-[#f7f7f5] border border-[#dedbd5] rounded-xl px-4 py-3 focus-within:border-[#202123] focus-within:bg-white transition-all">
                    <User size={18} className="text-[#6f6d69] mr-3 shrink-0" />
                    <input
                      type="text"
                      value={nama}
                      onChange={(e) => setNama(e.target.value)}
                      placeholder="Masukkan nama lengkap Anda"
                      required
                      className="w-full bg-transparent border-none outline-none text-sm text-[#202123] placeholder:text-[#6f6d69]/60"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-[#6f6d69] uppercase tracking-wide">
                      Alamat Email
                    </label>
                    <span className="text-[10px] font-semibold text-[#777572]">
                      Tidak dapat diubah
                    </span>
                  </div>
                  <div className="bg-[#eeece8] border border-[#dedbd5] rounded-xl px-4 py-3 text-sm text-[#777572] cursor-not-allowed">
                    {email}
                  </div>
                </div>
              </div>

              {/* Section 2: Kata Sandi */}
              <div className="rounded-[24px] border border-[#dedbd5] bg-white p-6 shadow-sm space-y-5">
                <div>
                  <h3 className="text-base font-bold text-[#202123]">
                    Keamanan & Kata Sandi
                  </h3>
                  <p className="text-xs text-[#6f6d69] mt-0.5">
                    {isOAuth
                      ? "Akun Anda terhubung dengan Google. Kata sandi dikelola secara aman oleh Google."
                      : "Biarkan kolom di bawah ini kosong jika Anda tidak ingin mengubah kata sandi."}
                  </p>
                </div>

                {!isOAuth && (
                  <div className="space-y-4 pt-1">
                    {/* Password Saat Ini */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-[#6f6d69]">
                        Password Saat Ini
                      </label>
                      <div className="relative flex items-center bg-[#f7f7f5] border border-[#dedbd5] rounded-xl px-4 py-3 focus-within:border-[#202123] focus-within:bg-white transition-all">
                        <Lock size={18} className="text-[#6f6d69] mr-3 shrink-0" />
                        <input
                          type={showCurrentPw ? "text" : "password"}
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          placeholder="Masukkan password saat ini"
                          className="w-full bg-transparent border-none outline-none text-sm text-[#202123] placeholder:text-[#6f6d69]/60"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPw((p) => !p)}
                          className="text-[#6f6d69] hover:text-[#202123] p-1 cursor-pointer"
                        >
                          {showCurrentPw ? <EyeSlash size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>

                    {/* Password Baru */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-[#6f6d69]">
                        Password Baru
                      </label>
                      <div className="relative flex items-center bg-[#f7f7f5] border border-[#dedbd5] rounded-xl px-4 py-3 focus-within:border-[#202123] focus-within:bg-white transition-all">
                        <Lock size={18} className="text-[#6f6d69] mr-3 shrink-0" />
                        <input
                          type={showNewPw ? "text" : "password"}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Minimal 8 karakter"
                          className="w-full bg-transparent border-none outline-none text-sm text-[#202123] placeholder:text-[#6f6d69]/60"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPw((p) => !p)}
                          className="text-[#6f6d69] hover:text-[#202123] p-1 cursor-pointer"
                        >
                          {showNewPw ? <EyeSlash size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>

                    {/* Konfirmasi Password Baru */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-[#6f6d69]">
                        Konfirmasi Password Baru
                      </label>
                      <div className="relative flex items-center bg-[#f7f7f5] border border-[#dedbd5] rounded-xl px-4 py-3 focus-within:border-[#202123] focus-within:bg-white transition-all">
                        <Lock size={18} className="text-[#6f6d69] mr-3 shrink-0" />
                        <input
                          type={showNewPw ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Ulangi password baru"
                          className="w-full bg-transparent border-none outline-none text-sm text-[#202123] placeholder:text-[#6f6d69]/60"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <Link
                  href="/dashboard"
                  className="px-5 py-2.5 text-sm font-semibold text-[#6f6d69] hover:text-[#202123] rounded-full hover:bg-white border border-transparent hover:border-[#dedbd5] transition-all cursor-pointer"
                >
                  Batal
                </Link>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-[#202123] hover:bg-[#38393a] rounded-full active:scale-[0.98] transition-all disabled:opacity-60 cursor-pointer shadow-md"
                >
                  {isLoading ? (
                    <>
                      <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Menyimpan...
                    </>
                  ) : (
                    "Simpan Perubahan"
                  )}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}
