"use client";

import { useState, useRef, type ChangeEvent, type FormEvent } from "react";
import {
  Camera,
  CheckCircle,
  Eye,
  EyeSlash,
  Lock,
  User,
  WarningCircle,
  X,
} from "@phosphor-icons/react";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentName: string;
  currentEmail?: string | null;
  currentAvatar?: string | null;
  onProfileUpdated: (updated: { nama: string; avatar?: string | null }) => void;
}

export default function EditProfileModal({
  isOpen,
  onClose,
  currentName,
  currentEmail,
  currentAvatar,
  onProfileUpdated,
}: EditProfileModalProps) {
  const [nama, setNama] = useState(currentName);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    currentAvatar || null
  );
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  function handleImageChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Batasi ukuran maks 2MB
    if (file.size > 2 * 1024 * 1024) {
      setError("Ukuran gambar maksimal 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
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
      };

      if (avatarPreview !== currentAvatar) {
        payload.avatar = avatarPreview;
      }

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

      // Update state di komponen induk & localStorage
      onProfileUpdated({
        nama: data.data.nama,
        avatar: data.data.avatar,
      });

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

      setSuccess("Profil Anda berhasil diperbarui!");
      setTimeout(() => {
        onClose();
        setSuccess(null);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }, 1200);
    } catch {
      setError("Tidak dapat terhubung ke server.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg rounded-[28px] bg-white p-6 md:p-8 shadow-[0_24px_70px_rgba(48,43,38,0.2)] border border-[#dedbd5] max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-[#6f6d69] hover:text-[#202123] hover:bg-[#f5f5f7] transition-colors duration-150 cursor-pointer"
          aria-label="Tutup"
        >
          <X size={18} weight="bold" />
        </button>

        {/* Title */}
        <div className="mb-6">
          <h2 className="text-xl font-bold tracking-tight text-[#202123]">
            Edit Profil
          </h2>
          <p className="text-xs text-[#6f6d69] mt-0.5">
            Perbarui informasi akun, foto profil, dan kata sandi Anda.
          </p>
        </div>

        {/* Alerts */}
        {error && (
          <div className="flex items-center gap-2.5 px-3.5 py-2.5 mb-4 rounded-xl text-xs font-medium text-red-700 bg-red-50 border border-red-200">
            <WarningCircle size={16} weight="fill" className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2.5 px-3.5 py-2.5 mb-4 rounded-xl text-xs font-medium text-green-700 bg-green-50 border border-green-200">
            <CheckCircle size={16} weight="fill" className="shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Avatar Section */}
          <div className="flex items-center gap-4 p-3 rounded-2xl bg-[#f7f7f5] border border-[#e5e3df]">
            <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-md bg-[#202123] text-white flex items-center justify-center shrink-0">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Avatar Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-xl font-bold">
                  {nama.charAt(0).toUpperCase() || "U"}
                </span>
              )}
            </div>

            <div className="flex-1">
              <p className="text-xs font-semibold text-[#202123]">
                Foto Profil
              </p>
              <p className="text-[11px] text-[#6f6d69] mb-2">
                Format JPG, PNG, atau WEBP (maks. 2MB)
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-white border border-[#dedbd5] text-[#202123] hover:bg-[#eceae7] transition-all cursor-pointer shadow-sm"
                >
                  <Camera size={14} weight="bold" />
                  Pilih Gambar
                </button>
                {avatarPreview && (
                  <button
                    type="button"
                    onClick={() => setAvatarPreview(null)}
                    className="px-2.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                  >
                    Hapus
                  </button>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
          </div>

          {/* Nama Lengkap */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#6f6d69] uppercase tracking-wide">
              Nama Lengkap
            </label>
            <div className="relative flex items-center bg-[#f7f7f5] border border-[#e5e3df] rounded-xl px-3.5 py-2.5 focus-within:border-[#202123] focus-within:bg-white transition-all">
              <User size={16} className="text-[#6f6d69] mr-2.5 shrink-0" />
              <input
                type="text"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                placeholder="Masukkan nama lengkap"
                required
                className="w-full bg-transparent border-none outline-none text-xs md:text-sm text-[#202123] placeholder:text-[#6f6d69]/60"
              />
            </div>
          </div>

          {/* Alamat Email (Read-only) */}
          {currentEmail && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#6f6d69] uppercase tracking-wide">
                Alamat Email
              </label>
              <div className="bg-[#eeece8] border border-[#e5e3df] rounded-xl px-3.5 py-2.5 text-xs md:text-sm text-[#777572] cursor-not-allowed">
                {currentEmail}
              </div>
            </div>
          )}

          {/* Ganti Password Section */}
          <div className="border-t border-[#f0ede9] pt-4 space-y-3">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#a15d3c]">
                Ganti Kata Sandi (Opsional)
              </h3>
              <p className="text-[11px] text-[#6f6d69]">
                Kosongkan jika tidak ingin mengubah kata sandi.
              </p>
            </div>

            {/* Password Saat Ini */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#6f6d69]">
                Password Saat Ini
              </label>
              <div className="relative flex items-center bg-[#f7f7f5] border border-[#e5e3df] rounded-xl px-3.5 py-2.5 focus-within:border-[#202123] focus-within:bg-white transition-all">
                <Lock size={16} className="text-[#6f6d69] mr-2.5 shrink-0" />
                <input
                  type={showCurrentPw ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Masukkan password saat ini"
                  className="w-full bg-transparent border-none outline-none text-xs md:text-sm text-[#202123] placeholder:text-[#6f6d69]/60"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPw((p) => !p)}
                  className="text-[#6f6d69] hover:text-[#202123] p-1 cursor-pointer"
                >
                  {showCurrentPw ? <EyeSlash size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Password Baru */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#6f6d69]">
                Password Baru
              </label>
              <div className="relative flex items-center bg-[#f7f7f5] border border-[#e5e3df] rounded-xl px-3.5 py-2.5 focus-within:border-[#202123] focus-within:bg-white transition-all">
                <Lock size={16} className="text-[#6f6d69] mr-2.5 shrink-0" />
                <input
                  type={showNewPw ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimal 8 karakter"
                  className="w-full bg-transparent border-none outline-none text-xs md:text-sm text-[#202123] placeholder:text-[#6f6d69]/60"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPw((p) => !p)}
                  className="text-[#6f6d69] hover:text-[#202123] p-1 cursor-pointer"
                >
                  {showNewPw ? <EyeSlash size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Konfirmasi Password Baru */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#6f6d69]">
                Konfirmasi Password Baru
              </label>
              <div className="relative flex items-center bg-[#f7f7f5] border border-[#e5e3df] rounded-xl px-3.5 py-2.5 focus-within:border-[#202123] focus-within:bg-white transition-all">
                <Lock size={16} className="text-[#6f6d69] mr-2.5 shrink-0" />
                <input
                  type={showNewPw ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Ulangi password baru"
                  className="w-full bg-transparent border-none outline-none text-xs md:text-sm text-[#202123] placeholder:text-[#6f6d69]/60"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs md:text-sm font-semibold text-[#6f6d69] hover:text-[#202123] rounded-xl hover:bg-[#f5f5f7] transition-all cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center justify-center gap-2 px-5 py-2 text-xs md:text-sm font-semibold text-white bg-[#202123] hover:bg-[#38393a] rounded-xl active:scale-[0.98] transition-all disabled:opacity-60 cursor-pointer shadow-sm"
            >
              {isLoading ? (
                <>
                  <span className="inline-block w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Menyimpan...
                </>
              ) : (
                "Simpan Perubahan"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
