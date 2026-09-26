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
    <div className="rounded-xl border border-indigo-100 bg-indigo-50/40 p-5 shadow-sm">
      <div className="mb-2 flex items-center gap-1.5 font-bold text-indigo-900">
        <Robot size={18} weight="fill" className="text-indigo-600" />
        <span className="text-sm">Analisis & Saran Gemini AI</span>
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <Spinner size={14} className="animate-spin" />
          Menyusun saran berdasarkan hasil ML...
        </div>
      )}
      {error && <p className="text-xs leading-relaxed text-red-700">{error}</p>}
      {advice && !loading && (
        <div className="space-y-3 text-xs leading-relaxed text-gray-700">
          <p>{advice.summary}</p>
          <p>{advice.riskInterpretation}</p>

          <div>
            <p className="mb-1 font-semibold text-gray-900">Faktor utama</p>
            <ul className="list-disc space-y-1 pl-4">
              {advice.keyFactors.map((factor) => (
                <li key={factor}>{factor}</li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-1 font-semibold text-gray-900">
              Langkah persiapan
            </p>
            <ul className="space-y-2">
              {advice.preparationSteps.map((step) => (
                <li key={`${step.priority}-${step.title}`}>
                  <span className="font-semibold">
                    [{step.priority}] {step.title}:
                  </span>{" "}
                  {step.action} {step.reason}
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t border-indigo-100 pt-2">
            <p className="font-semibold text-gray-900">Shelter dan rute</p>
            <p>{advice.recommendedShelter.reason}</p>
            <p>{advice.routeExplanation}</p>
          </div>

          <p className="border-t border-indigo-100 pt-2 text-[11px] text-gray-600">
            {advice.disclaimer}
          </p>
        </div>
      )}
      {!advice && !loading && !error && (
        <p className="text-xs text-gray-500">
          Saran Gemini akan muncul setelah analisis risiko dijalankan.
        </p>
      )}
    </div>
  );
}
