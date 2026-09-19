"use client";

import type { FormEvent, ReactNode } from "react";
import Link from "next/link";

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
    <div className="relative z-10 w-full max-w-md mx-auto p-10 bg-white/[0.04] border border-white/10 rounded-3xl backdrop-blur-2xl shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_20px_60px_rgba(0,0,0,0.5),0_0_80px_rgba(99,102,241,0.08)] animate-[cardIn_0.5s_cubic-bezier(0.16,1,0.3,1)_both]">
      {/* Glossy top edge */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-white/[0.07] to-transparent pointer-events-none" />

      {/* Brand */}
      <div className="flex items-center gap-2.5 mb-7">
        <div className="flex items-center justify-center drop-shadow-[0_4px_12px_rgba(99,102,241,0.4)]">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <rect width="32" height="32" rx="10" fill="url(#logoGrad)" />
            <path d="M8 16C8 11.582 11.582 8 16 8C20.418 8 24 11.582 24 16" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="16" cy="20" r="4" fill="white" />
            <defs>
              <linearGradient id="logoGrad" x1="0" y1="0" x2="32" y2="32">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
          Gtek
        </span>
      </div>

      {/* Header */}
      <div className="mb-7">
        <h1 className="text-2xl font-bold tracking-tight text-slate-100 mb-1.5">{title}</h1>
        <p className="text-sm text-slate-400">{subtitle}</p>
      </div>

      {/* Alert Messages */}
      {error && (
        <div className="flex items-center gap-2.5 px-4 py-3 mb-5 rounded-xl text-[13.5px] font-medium text-red-400 bg-red-400/10 border border-red-400/25 animate-[alertIn_0.3s_ease_both]" role="alert" aria-live="polite">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {error}
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2.5 px-4 py-3 mb-5 rounded-xl text-[13.5px] font-medium text-green-400 bg-green-400/10 border border-green-400/25 animate-[alertIn_0.3s_ease_both]" role="status" aria-live="polite">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
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
          className="relative inline-flex items-center justify-center gap-2 w-full py-3.5 px-6 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-[15px] font-semibold rounded-xl border-none cursor-pointer overflow-hidden transition-all duration-150 shadow-[0_4px_20px_rgba(99,102,241,0.35)] hover:shadow-[0_6px_28px_rgba(99,102,241,0.5)] hover:-translate-y-px active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" aria-hidden="true" />
              Memproses...
            </>
          ) : (
            submitLabel
          )}
        </button>
      </form>

      {/* Footer Link */}
      <p className="mt-6 text-center text-sm text-slate-400">
        {footerText}{" "}
        <Link href={footerLinkHref} className="text-indigo-400 font-semibold no-underline hover:text-purple-400 hover:underline underline-offset-[3px] transition-colors duration-150">
          {footerLinkText}
        </Link>
      </p>
    </div>
  );
}
