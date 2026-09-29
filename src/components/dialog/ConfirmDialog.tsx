"use client";

import { WarningCircle, X } from "@phosphor-icons/react";
import { type ReactNode, useEffect } from "react";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  error?: string | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Konfirmasi",
  cancelLabel = "Batal",
  loading = false,
  error = null,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !loading) {
        onCancel();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [loading, onCancel, open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-[#202123]/45 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !loading) onCancel();
      }}
      role="presentation"
    >
      <section
        aria-labelledby="confirm-dialog-title"
        aria-modal="true"
        className="w-full max-w-md rounded-[26px] border border-[#e5e3df] bg-[#f7f7f5] p-5 shadow-[0_24px_70px_rgba(32,33,35,0.24)] sm:p-6"
        role="alertdialog"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
              <WarningCircle size={22} weight="fill" />
            </div>
            <div>
              <h2
                className="text-base font-semibold text-[#202123]"
                id="confirm-dialog-title"
              >
                {title}
              </h2>
              <div className="mt-1.5 text-sm leading-6 text-[#777572]">
                {description}
              </div>
            </div>
          </div>
          <button
            aria-label="Tutup dialog"
            className="rounded-full p-1.5 text-[#777572] transition hover:bg-[#eeece8] hover:text-[#202123] disabled:opacity-50"
            disabled={loading}
            onClick={onCancel}
            type="button"
          >
            <X size={18} />
          </button>
        </div>

        {error && (
          <p
            className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3.5 py-3 text-xs leading-5 text-red-700"
            role="alert"
          >
            {error}
          </p>
        )}

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            className="rounded-xl px-4 py-3 text-sm font-semibold text-[#6f6d69] transition hover:bg-[#eeece8] disabled:opacity-50"
            disabled={loading}
            onClick={onCancel}
            type="button"
          >
            {cancelLabel}
          </button>
          <button
            className="rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={loading}
            onClick={onConfirm}
            type="button"
          >
            {loading ? "Menghapus..." : confirmLabel}
          </button>
        </div>
      </section>
    </div>
  );
}
