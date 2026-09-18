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
    <div className="auth-card">
      {/* Logo / Brand */}
      <div className="auth-brand">
        <div className="auth-logo">
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <rect width="32" height="32" rx="10" fill="url(#logoGrad)" />
            <path
              d="M8 16C8 11.582 11.582 8 16 8C20.418 8 24 11.582 24 16"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <circle cx="16" cy="20" r="4" fill="white" />
            <defs>
              <linearGradient id="logoGrad" x1="0" y1="0" x2="32" y2="32">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <span className="auth-brand-name">AuthSecure</span>
      </div>

      {/* Header */}
      <div className="auth-header">
        <h1 className="auth-title">{title}</h1>
        <p className="auth-subtitle">{subtitle}</p>
      </div>

      {/* Alert Messages */}
      {error && (
        <div className="alert alert--error" role="alert" aria-live="polite">
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
        <div className="alert alert--success" role="status" aria-live="polite">
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
      <form onSubmit={onSubmit} className="auth-form" noValidate>
        {children}

        <button
          id="submit-btn"
          type="submit"
          disabled={isLoading}
          className="btn-primary"
        >
          {isLoading ? (
            <>
              <span className="spinner" aria-hidden="true" />
              Memproses...
            </>
          ) : (
            submitLabel
          )}
        </button>
      </form>

      {/* Footer Link */}
      <p className="auth-footer">
        {footerText}{" "}
        <Link href={footerLinkHref} className="auth-link">
          {footerLinkText}
        </Link>
      </p>
    </div>
  );
}
