"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import AiGemini from "@/components/Ai/AiGemini";
import RiskAnalysisCard from "@/components/Ai/RiskAnalysisCard";
import type {
  GeminiAdviceResponse,
  GeminiStructuredAdvice,
  RiskAnalysisResponse,
  RiskAnalysisResult,
  SavedRiskAnalysisResponse,
} from "@/types";

export default function RiskAnalysisSection() {
  const [riskData, setRiskData] = useState<RiskAnalysisResult | null>(null);
  const [advice, setAdvice] = useState<GeminiStructuredAdvice | null>(null);
  const [riskLoading, setRiskLoading] = useState(false);
  const [geminiLoading, setGeminiLoading] = useState(false);
  const [riskError, setRiskError] = useState<string | null>(null);
  const [geminiError, setGeminiError] = useState<string | null>(null);
  const [cityName, setCityName] = useState<string | null>(null);
  const [showCityPrompt, setShowCityPrompt] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadSavedAnalysis = async () => {
      setRiskLoading(true);
      setGeminiLoading(true);

      try {
        const profileResponse = await fetch("/api/user/profile");
        if (!profileResponse.ok) throw new Error("Gagal memuat profil.");
        const profileResult = await profileResponse.json();
        const savedCity = profileResult.data?.cityName ?? null;
        if (cancelled) return;
        setCityName(savedCity);

        if (!savedCity) {
          return;
        }

        const response = await fetch("/api/risk-analysis");
        if (response.status === 404) return;

        const result = (await response.json()) as
          | SavedRiskAnalysisResponse
          | { error?: string };
        if (!response.ok || !("mlResult" in result)) {
          throw new Error(
            "error" in result
              ? result.error
              : "Gagal memuat analisis tersimpan.",
          );
        }

        if (!cancelled) {
          setRiskData(result.mlResult);
          setAdvice(result.aiAdvice);
        }
      } catch (error) {
        if (!cancelled) {
          setRiskError(
            error instanceof Error
              ? error.message
              : "Gagal memuat analisis tersimpan.",
          );
        }
      } finally {
        if (!cancelled) {
          setRiskLoading(false);
          setGeminiLoading(false);
        }
      }
    };

    void loadSavedAnalysis();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!showCityPrompt) return;

    const timeoutId = window.setTimeout(() => {
      setShowCityPrompt(false);
    }, 2000);

    return () => window.clearTimeout(timeoutId);
  }, [showCityPrompt]);

  const handleAnalyze = async () => {
    setRiskLoading(true);
    setGeminiLoading(true);
    setRiskData(null);
    setRiskError(null);
    setGeminiError(null);
    setAdvice(null);

    try {
      if (!cityName) {
        setShowCityPrompt(true);
        return;
      }

      const riskResponse = await fetch("/api/risk-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const riskResult = (await riskResponse.json()) as
        | RiskAnalysisResponse
        | { error?: string };

      if (!riskResponse.ok || !("mlResult" in riskResult)) {
        throw new Error(
          "error" in riskResult
            ? riskResult.error
            : "Gagal mengambil hasil analisis risiko.",
        );
      }

      const geminiResponse = await fetch("/api/ai-gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          analysisId: riskResult.analysisId,
        }),
      });
      const geminiResult = (await geminiResponse.json()) as
        | GeminiAdviceResponse
        | { error?: string };

      if (!geminiResponse.ok || !("aiAdvice" in geminiResult)) {
        setGeminiError(
          "error" in geminiResult
            ? (geminiResult.error ?? "Saran Gemini belum tersedia.")
            : "Saran Gemini belum tersedia.",
        );
        return;
      }

      setRiskData(riskResult.mlResult);
      setAdvice(geminiResult.aiAdvice);
    } catch (error) {
      setRiskError(
        error instanceof Error
          ? error.message
          : "Gagal mengambil hasil analisis risiko.",
      );
    } finally {
      setRiskLoading(false);
      setGeminiLoading(false);
    }
  };

  const isLoading = riskLoading || geminiLoading;

  return (
    <div className="space-y-4">
      <div>
        <RiskAnalysisCard
          data={riskData}
          locationName={cityName}
          loading={isLoading}
          error={riskError}
          onAnalyze={handleAnalyze}
        />
        <AiGemini advice={advice} loading={isLoading} error={geminiError} />
      </div>
      <div>
        {showCityPrompt && (
          <div className="fixed right-4 top-4 z-50 w-[min(22rem,calc(100vw-2rem))] rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 shadow-lg">
            <p className="text-sm font-semibold text-amber-950">
              Pilih kota di profile terlebih dahulu
            </p>
            <p className="mt-1 text-xs leading-relaxed text-amber-800">
              Lokasi ini diperlukan untuk menjalankan analisis risiko.
            </p>
            <Link
              href="/profile"
              className="mt-2 inline-block text-xs font-semibold text-amber-950 underline underline-offset-2 hover:text-amber-700"
            >
              Buka Profile
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
