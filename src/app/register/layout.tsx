import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Daftar — AuthSecure",
  description: "Buat akun baru di AuthSecure.",
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="auth-page-wrapper">
      <div className="blob blob--1" aria-hidden="true" />
      <div className="blob blob--2" aria-hidden="true" />
      {children}
    </div>
  );
}
