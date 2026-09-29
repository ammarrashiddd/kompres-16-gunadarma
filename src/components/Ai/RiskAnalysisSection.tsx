"use client";

import { useEffect, useState } from "react";
import AiGemini from "@/components/Ai/AiGemini";
import RiskAnalysisCard from "@/components/Ai/RiskAnalysisCard";
import Toast from "@/components/feedback/Toast";
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
      <Toast
        actionHref="/profile"
        actionLabel="Buka Profile"
        description="Lokasi ini diperlukan untuk menjalankan analisis risiko."
        onClose={() => setShowCityPrompt(false)}
        open={showCityPrompt}
        title="Pilih kota di profile terlebih dahulu"
      />
    </div>
  );
}
