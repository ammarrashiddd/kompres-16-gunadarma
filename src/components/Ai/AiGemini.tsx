"use client";

import { Robot, Spinner } from "@phosphor-icons/react";
import type { GeminiStructuredAdvice } from "@/types";

interface AiGeminiProps {
  advice: GeminiStructuredAdvice | null;
  loading: boolean;
  error: string | null;
}

export default function AiGemini({ advice, loading, error }: AiGeminiProps) {
  return (
    <section className="rounded-2xl border border-[#eadbd3] bg-[#fffaf6] p-5 shadow-[0_12px_30px_rgba(161,93,60,0.07)] md:p-6">
      <div className="mb-5 flex items-start gap-3 border-b border-[#f0e1da] pb-4">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#f1e5df] text-[#c85b31]">
          <Robot size={21} weight="fill" />
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#c85b31]">
            Penjelasan berbasis AI
          </p>
          <h3 className="mt-1 text-base font-semibold text-[#202123]">
            Penjelasan Gemini AI
          </h3>
          <p className="mt-1 text-xs leading-5 text-[#777572]">
            Hasil ML diterjemahkan ke bahasa yang lebih mudah dipahami.
          </p>
        </div>
      </div>

      {loading && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-medium text-[#777572]">
            <Spinner className="animate-spin text-[#c85b31]" size={14} />
            Menerjemahkan hasil analisis...
          </div>
          <div className="space-y-2 animate-pulse">
            <div className="h-3 w-full rounded bg-[#eadbd3]" />
            <div className="h-3 w-11/12 rounded bg-[#eadbd3]" />
            <div className="h-3 w-4/5 rounded bg-[#eadbd3]" />
          </div>
        </div>
      )}
      {error && (
        <p className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-3 text-xs leading-5 text-red-700">
          {error}
        </p>
      )}
      {advice && !loading && (
        <div className="space-y-5 text-sm leading-6 text-[#55524e]">
          <div>
            <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#a44b29]">
              Ringkasan
            </p>
            <p>{advice.summary}</p>
          </div>

          <div className="border-l-2 border-[#d8b6a8] pl-4">
            <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#a44b29]">
              Cara membaca hasil
            </p>
            <p>{advice.riskInterpretation}</p>
          </div>

          <div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[#a44b29]">
              Faktor yang membentuk hasil
            </p>
            <ul className="space-y-2.5">
              {advice.keyFactors.map((factor, index) => (
                <li className="flex items-start gap-2.5" key={factor}>
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md bg-[#f1e5df] text-[10px] font-bold text-[#a44b29]">
                    {index + 1}
                  </span>
                  <span>{factor}</span>
                </li>
              ))}
            </ul>
          </div>

          <p className="border-t border-[#eadbd3] pt-3 text-xs leading-5 text-[#777572]">
            {advice.disclaimer}
          </p>
        </div>
      )}
      {!advice && !loading && !error && (
        <p className="rounded-xl border border-dashed border-[#d8d5d0] bg-white/60 px-4 py-7 text-center text-xs leading-5 text-[#777572]">
          Penjelasan Gemini akan muncul setelah analisis risiko dijalankan.
        </p>
      )}
    </section>
  );
}
