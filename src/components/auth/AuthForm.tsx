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
    <div className="relative z-10 w-full max-w-md mx-auto">
      {/* Card */}
      <div className="bg-white rounded-[24px] shadow-[0_16px_48px_rgba(48,43,38,0.10)] px-8 py-10">
        {/* Brand */}
        <div className="flex items-center gap-2.5 mb-8">
          <div className="w-8 h-8 rounded-[10px] bg-[#202123] flex items-center justify-center flex-shrink-0">
            <svg width="18" height="18" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M8 16C8 11.582 11.582 8 16 8C20.418 8 24 11.582 24 16" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
              <circle cx="16" cy="20" r="4" fill="white" />
            </svg>
          </div>
          <span className="text-lg font-bold tracking-tight text-[#202123]">Gtek</span>
        </div>

        {/* Header */}
        <div className="mb-7">
          <h1 className="text-2xl font-semibold tracking-tight text-[#202123] mb-1.5">{title}</h1>
          <p className="text-sm text-[#6e6e73]">{subtitle}</p>
        </div>

        {/* Alert Messages */}
        {error && (
          <div className="flex items-center gap-2.5 px-4 py-3 mb-5 rounded-xl text-[13.5px] font-medium text-red-700 bg-[#fce4e4] border border-red-200 animate-[alertIn_0.3s_ease_both]" role="alert" aria-live="polite">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {error}
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2.5 px-4 py-3 mb-5 rounded-xl text-[13.5px] font-medium text-green-700 bg-[#e8f5e9] border border-green-200 animate-[alertIn_0.3s_ease_both]" role="status" aria-live="polite">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
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
                <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" aria-hidden="true" />
                Memproses...
              </>
            ) : (
              submitLabel
            )}
          </button>
        </form>

        {/* Footer Link */}
        <p className="mt-6 text-center text-sm text-[#6e6e73]">
          {footerText}{" "}
          <Link href={footerLinkHref} className="text-[#202123] font-semibold hover:underline underline-offset-[3px] transition-colors duration-150">
            {footerLinkText}
          </Link>
        </p>
      </div>
    </div>
  );
}
