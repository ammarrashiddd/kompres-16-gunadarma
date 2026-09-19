import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login — Gtek",
  description: "Masuk ke akun Gtek Anda.",
};

export default function LoginLayout({ children }: LayoutProps<"/login">) {
  return (
    <div className="relative min-h-dvh flex items-center justify-center px-4 py-6 overflow-hidden">
      {/* Blob 1 */}
      <div className="fixed -top-28 -left-24 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,#6366f1,transparent)] opacity-35 blur-[80px] pointer-events-none animate-[blobFloat_8s_ease-in-out_infinite]" aria-hidden="true" />
      {/* Blob 2 */}
      <div className="fixed -bottom-20 -right-20 w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,#a855f7,transparent)] opacity-35 blur-[80px] pointer-events-none animate-[blobFloat_8s_ease-in-out_infinite_-3s]" aria-hidden="true" />
      {children}
    </div>
  );
}
