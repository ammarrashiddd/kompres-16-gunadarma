"use client";

import { CheckCircle, WarningCircle, X } from "@phosphor-icons/react";
import Link from "next/link";
import { useEffect } from "react";

interface ToastProps {
  open: boolean;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  durationMs?: number;
  tone?: "warning" | "success";
  onClose: () => void;
}

export default function Toast({
  open,
  title,
  description,
  actionLabel,
  actionHref,
  durationMs = 2000,
  tone = "warning",
  onClose,
}: ToastProps) {
  useEffect(() => {
    if (!open) return;

    const timeoutId = window.setTimeout(onClose, durationMs);
    return () => window.clearTimeout(timeoutId);
  }, [durationMs, onClose, open]);

  if (!open) return null;

  const isSuccess = tone === "success";

  return (
    <output
      aria-live="polite"
      className={`fixed right-4 top-4 z-50 w-[min(22rem,calc(100vw-2rem))] animate-in fade-in slide-in-from-top-2 rounded-2xl border p-4 shadow-[0_16px_40px_rgba(32,33,35,0.16)] ${isSuccess ? "border-emerald-200 bg-[#f4fbf4]" : "border-amber-200 bg-[#fffaf0]"}`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`flex size-9 shrink-0 items-center justify-center rounded-xl ${isSuccess ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}
        >
          {isSuccess ? (
            <CheckCircle size={19} weight="fill" />
          ) : (
            <WarningCircle size={19} weight="fill" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p
            className={`pr-5 text-sm font-semibold ${isSuccess ? "text-emerald-950" : "text-amber-950"}`}
          >
            {title}
          </p>
          <p
            className={`mt-1 text-xs leading-5 ${isSuccess ? "text-emerald-800" : "text-amber-800"}`}
          >
            {description}
          </p>
          {actionLabel && actionHref && (
            <Link
              className={`mt-2 inline-flex text-xs font-semibold underline underline-offset-2 transition ${isSuccess ? "text-emerald-950 hover:text-emerald-700" : "text-amber-950 hover:text-amber-700"}`}
              href={actionHref}
            >
              {actionLabel}
            </Link>
          )}
        </div>
        <button
          aria-label="Tutup notifikasi"
          className={`-mr-1 -mt-1 rounded-lg p-1 transition ${isSuccess ? "text-emerald-800 hover:bg-emerald-100 hover:text-emerald-950" : "text-amber-800 hover:bg-amber-100 hover:text-amber-950"}`}
          onClick={onClose}
          type="button"
        >
          <X size={16} />
        </button>
      </div>
    </output>
  );
}
