import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Daftar — SIGAP",
  description: "Buat akun baru di SIGAP.",
};

export default function RegisterLayout({ children }: LayoutProps<"/register">) {
  return (
    <div className="auth-shell relative flex min-h-dvh items-center justify-center overflow-hidden px-4 py-8">
      {children}
    </div>
  );
}
