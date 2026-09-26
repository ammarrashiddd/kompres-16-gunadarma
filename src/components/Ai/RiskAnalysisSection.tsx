"use client";

import { useState } from "react";
import AiGemini from "@/components/Ai/AiGemini";
import RiskAnalysisCard from "@/components/Ai/RiskAnalysisCard";
import type {
  GeminiAdviceResponse,
  GeminiStructuredAdvice,
  RiskAnalysisResponse,
  RiskAnalysisResult,
} from "@/types";

const analysisLocation = {
  lat: -6.2383,
  lon: 106.9756,
  locationName: "Kota Bekasi, Jawa Barat",
};

export default function RiskAnalysisSection() {
  const [riskData, setRiskData] = useState<RiskAnalysisResult | null>(null);
  const [advice, setAdvice] = useState<GeminiStructuredAdvice | null>(null);
  const [riskLoading, setRiskLoading] = useState(false);
  const [geminiLoading, setGeminiLoading] = useState(false);
  const [riskError, setRiskError] = useState<string | null>(null);
  const [geminiError, setGeminiError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    setRiskLoading(true);
    setGeminiLoading(true);
    setRiskData(null);
    setRiskError(null);
    setGeminiError(null);
    setAdvice(null);

    try {
      const riskResponse = await fetch("/api/risk-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(analysisLocation),
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
      <RiskAnalysisCard
        data={riskData}
        loading={isLoading}
        error={riskError}
        onAnalyze={handleAnalyze}
      />
      <AiGemini advice={advice} loading={isLoading} error={geminiError} />
    </div>
  );
}
