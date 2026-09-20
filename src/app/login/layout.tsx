import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Masuk — SIGAP",
  description: "Masuk ke akun SIGAP Anda.",
};

export default function LoginLayout({ children }: LayoutProps<"/login">) {
  return (
    <div className="auth-shell relative flex min-h-dvh items-center justify-center overflow-hidden px-4 py-8">
      {children}
    </div>
  );
}
