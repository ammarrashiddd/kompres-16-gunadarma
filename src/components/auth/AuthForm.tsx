"use client";

import type { FormEvent, ReactNode } from "react";
import Link from "next/link";
import { GithubLogo, GoogleLogo } from "@phosphor-icons/react";

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
    <div className="relative z-10 mx-auto w-full max-w-102.5 rounded-[30px] border border-[#dedbd6] bg-[#f7f7f5] p-7 text-[#202123] shadow-[0_24px_70px_rgba(48,43,38,0.14)] md:p-9">
      {/* Brand */}
      <div className="flex items-center gap-2.5 mb-7">
        <div className="flex items-center justify-center">
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <rect width="32" height="32" rx="8" fill="#df5e3b" />
            <path
              d="M8 16C8 11.582 11.582 8 16 8C20.418 8 24 11.582 24 16"
              stroke="#160f0d"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <circle cx="16" cy="20" r="4" fill="#160f0d" />
            <defs></defs>
          </svg>
        </div>
        <span className="text-lg font-semibold tracking-[-0.06em] text-[#202123]">
          SIGAP<span className="text-[#a15d3c]">.</span>
        </span>
      </div>

      {/* Header */}
      <div className="mb-7">
        <h1 className="mb-1.5 text-2xl font-semibold tracking-[-0.06em] text-[#202123]">
          {title}
        </h1>
        <p className="text-sm text-[#777572]">{subtitle}</p>
      </div>

      {/* Alert Messages */}
      {error && (
        <div
          className="mb-5 flex items-center gap-2.5 rounded-[10px] border border-[#df6f4c]/35 bg-[#df6f4c]/10 px-4 py-3 text-[13.5px] font-medium text-[#a14d32]"
          role="alert"
          aria-live="polite"
        >
          <svg
            width="16"
            height="16"
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
          className="mb-5 flex items-center gap-2.5 rounded-[10px] border border-[#72a879]/35 bg-[#e8f5e9] px-4 py-3 text-[13.5px] font-medium text-[#47794d]"
          role="status"
          aria-live="polite"
        >
          <svg
            width="16"
            height="16"
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
          className="relative inline-flex w-full items-center justify-center gap-2 rounded-[10px] border-none bg-[#a15d3c] px-6 py-3.5 text-[14px] font-semibold text-white transition-all duration-150 hover:-translate-y-px hover:bg-[#8f4e31] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isLoading ? (
            <>
              <span
                className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"
                aria-hidden="true"
              />
              Memproses...
            </>
          ) : (
            submitLabel
          )}
        </button>
      </form>

      <div className="my-5 flex items-center gap-3 text-[10px] uppercase tracking-[0.18em] text-[#aaa6a1]">
        <span className="h-px flex-1 bg-[#dedbd6]" />
        atau lanjut dengan
        <span className="h-px flex-1 bg-[#dedbd6]" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <a
          href="/api/auth/google"
          className="inline-flex items-center justify-center gap-2 rounded-[10px] border border-[#dedbd6] bg-white px-3 py-2.5 text-xs font-medium text-[#4f4d4a] transition-colors hover:bg-[#efeeeb]"
        >
          <GoogleLogo size={16} weight="bold" /> Google
        </a>
        <a
          href="/api/auth/github"
          className="inline-flex items-center justify-center gap-2 rounded-[10px] border border-[#dedbd6] bg-white px-3 py-2.5 text-xs font-medium text-[#4f4d4a] transition-colors hover:bg-[#efeeeb]"
        >
          <GithubLogo size={16} weight="fill" /> GitHub
        </a>
      </div>

      {/* Footer Link */}
      <p className="mt-6 text-center text-sm text-[#777572]">
        {footerText}{" "}
        <Link
          href={footerLinkHref}
          className="font-semibold text-[#a15d3c] underline-offset-[3px] transition-colors duration-150 hover:text-[#8f4e31] hover:underline"
        >
          {footerLinkText}
        </Link>
      </p>
    </div>
  );
}
