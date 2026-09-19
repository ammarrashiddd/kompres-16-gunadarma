import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login — AuthSecure",
  description: "Masuk ke akun AuthSecure Anda.",
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="auth-page-wrapper">
      <div className="blob blob--1" aria-hidden="true" />
      <div className="blob blob--2" aria-hidden="true" />
      {children}
    </div>
  );
}
