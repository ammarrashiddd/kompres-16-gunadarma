"use client";

import type { FormEvent, ReactNode } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";

interface AuthFormProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  submitLabel: string;
  isLoading: boolean;
  error: string | null;
  success: string | null;
  footerText: string;
  footerLinkText: string;
  footerLinkHref: string;
}

export default function AuthForm({
  title,
  subtitle,
  children,
  onSubmit,
  submitLabel,
  isLoading,
  error,
  success,
  footerText,
  footerLinkText,
  footerLinkHref,
}: AuthFormProps) {
  return (
    <div className="relative z-10 w-full max-w-md mx-auto">
      <Link
        href="/"
        className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-[#6e6e73] transition-colors hover:text-[#202123]"
      >
        <svg
          width="17"
          height="17"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="m15 18-6-6 6-6" />
        </svg>
        Kembali ke halaman utama
      </Link>

      {/* Card */}
      <div className="bg-white rounded-[24px] shadow-[0_16px_48px_rgba(48,43,38,0.10)] px-8 py-10">
        {/* Brand */}
        <div className="flex items-center gap-2.5 mb-8">
          <div className="w-8 h-8 rounded-[10px] bg-[#202123] flex items-center justify-center flex-shrink-0">
            <svg
              width="18"
              height="18"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M8 16C8 11.582 11.582 8 16 8C20.418 8 24 11.582 24 16"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <circle cx="16" cy="20" r="4" fill="white" />
            </svg>
          </div>
          <span className="text-lg font-bold tracking-tight text-[#202123]">
            Gtek
          </span>
        </div>

        {/* Header */}
        <div className="mb-7">
          <h1 className="text-2xl font-semibold tracking-tight text-[#202123] mb-1.5">
            {title}
          </h1>
          <p className="text-sm text-[#6e6e73]">{subtitle}</p>
        </div>

        {/* Alert Messages */}
        {error && (
          <div
            className="flex items-center gap-2.5 px-4 py-3 mb-5 rounded-xl text-[13.5px] font-medium text-red-700 bg-[#fce4e4] border border-red-200 animate-[alertIn_0.3s_ease_both]"
            role="alert"
            aria-live="polite"
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {error}
          </div>
        )}

        {success && (
          <div
            className="flex items-center gap-2.5 px-4 py-3 mb-5 rounded-xl text-[13.5px] font-medium text-green-700 bg-[#e8f5e9] border border-green-200 animate-[alertIn_0.3s_ease_both]"
            role="status"
            aria-live="polite"
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            {success}
          </div>
        )}

        {/* Form */}
        <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
          {children}

          <button
            id="submit-btn"
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center justify-center gap-2 w-full py-3 px-6 bg-[#202123] text-white text-[15px] font-semibold rounded-xl cursor-pointer transition-all duration-150 hover:bg-[#38393a] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <span
                  className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"
                  aria-hidden="true"
                />
                Memproses...
              </>
            ) : (
              submitLabel
            )}
          </button>
        </form>

        {/* Separator */}
        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 h-px bg-[#e5e5ea]" />
          <span className="text-xs text-[#6e6e73] font-medium">atau</span>
          <div className="flex-1 h-px bg-[#e5e5ea]" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Google OAuth Button */}
          <button
            type="button"
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="w-full flex items-center justify-center gap-2 py-3 px-3 bg-white border border-[#e5e5ea] rounded-xl text-[14px] font-semibold text-[#202123] hover:bg-[#f5f5f7] active:scale-[0.98] transition-all duration-150 shadow-sm cursor-pointer"
          >
            {/* Google logo SVG */}
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Google
          </button>

          {/* GitHub OAuth Button */}
          <button
            type="button"
            onClick={() => {
              window.location.href = "/api/auth/github";
            }}
            className="w-full flex items-center justify-center gap-2 py-3 px-3 bg-[#202123] border border-[#202123] rounded-xl text-[14px] font-semibold text-white hover:bg-[#38393a] active:scale-[0.98] transition-all duration-150 shadow-sm cursor-pointer"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M12 2C6.477 2 2 6.59 2 12.25c0 4.53 2.865 8.37 6.839 9.72.5.095.682-.22.682-.492 0-.237-.009-.866-.014-1.7-2.782.62-3.369-1.37-3.369-1.37-.455-1.18-1.11-1.495-1.11-1.495-.908-.636.069-.623.069-.623 1.004.073 1.532 1.055 1.532 1.055.892 1.57 2.341 1.117 2.91.854.091-.664.349-1.117.635-1.374-2.22-.26-4.555-1.14-4.555-5.073 0-1.12.39-2.034 1.029-2.751-.103-.26-.446-1.303.098-2.715 0 0 .839-.275 2.75 1.05A9.21 9.21 0 0 1 12 7.31a9.3 9.3 0 0 1 2.504.35c1.91-1.325 2.748-1.05 2.748-1.05.545 1.412.202 2.455.1 2.715.64.717 1.028 1.632 1.028 2.751 0 3.944-2.339 4.81-4.566 5.065.359.317.678.944.678 1.903 0 1.374-.012 2.48-.012 2.816 0 .275.18.592.688.492A10.255 10.255 0 0 0 22 12.25C22 6.59 17.523 2 12 2Z" />
            </svg>
            GitHub
          </button>
        </div>

        {/* Footer Link */}
        <p className="mt-6 text-center text-sm text-[#6e6e73]">
          {footerText}{" "}
          <Link
            href={footerLinkHref}
            className="text-[#202123] font-semibold hover:underline underline-offset-[3px] transition-colors duration-150"
          >
            {footerLinkText}
          </Link>
        </p>
      </div>
    </div>
  );
}
