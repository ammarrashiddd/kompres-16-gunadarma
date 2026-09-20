import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login — Gtek",
  description: "Masuk ke akun Gtek Anda.",
};

export default function LoginLayout({ children }: LayoutProps<"/login">) {
  return (
    <div className="auth-shell relative min-h-dvh flex items-center justify-center px-4 py-12 overflow-hidden">
      {children}
    </div>
  );
}
