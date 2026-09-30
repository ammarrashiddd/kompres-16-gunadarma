import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Daftar — Gtek",
  description: "Buat akun baru di Gtek.",
};

export default function RegisterLayout({ children }: LayoutProps<"/register">) {
  return (
    <div className="auth-shell relative min-h-dvh flex items-center justify-center px-4 py-12 overflow-hidden">
      {children}
    </div>
  );
}
