import { GoogleGenAI } from "@google/genai";
import type { Prisma } from "@prisma/client";
import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/server-auth";
import type {
  GeminiStructuredAdvice,
  PreparationPriority,
  RiskAnalysisResult,
  RouteSnapshot,
} from "@/types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const geminiResponseSchema = {
  type: "object",
  properties: {
    summary: { type: "string" },
    riskInterpretation: { type: "string" },
    keyFactors: {
      type: "array",
      items: { type: "string" },
    },
    preparationSteps: {
      type: "array",
      items: {
        type: "object",
        properties: {
          priority: {
            type: "string",
            enum: ["URGENT", "HIGH", "MEDIUM"],
          },
          title: { type: "string" },
          action: { type: "string" },
          reason: { type: "string" },
        },
        required: ["priority", "title", "action", "reason"],
      },
    },
    recommendedShelter: {
      type: "object",
      properties: {
        shelterId: { type: "integer", nullable: true },
        reason: { type: "string" },
      },
      required: ["shelterId", "reason"],
    },
    routeExplanation: { type: "string" },
    disclaimer: { type: "string" },
  },
  required: [
    "summary",
    "riskInterpretation",
    "keyFactors",
    "preparationSteps",
    "recommendedShelter",
    "routeExplanation",
    "disclaimer",
  ],
} as const;

function isPreparationPriority(value: unknown): value is PreparationPriority {
  return value === "URGENT" || value === "HIGH" || value === "MEDIUM";
}

function isGeminiStructuredAdvice(
  value: unknown,
  routeCandidates: RouteSnapshot[],
): value is GeminiStructuredAdvice {
  if (!value || typeof value !== "object") return false;

  const advice = value as Record<string, unknown>;
  const steps = advice.preparationSteps;
  const recommendedShelter = advice.recommendedShelter;

  if (
    typeof advice.summary !== "string" ||
    typeof advice.riskInterpretation !== "string" ||
    !Array.isArray(advice.keyFactors) ||
    !advice.keyFactors.every((factor) => typeof factor === "string") ||
    !Array.isArray(steps) ||
    !steps.every((step) => {
      if (!step || typeof step !== "object") return false;
      const item = step as Record<string, unknown>;
      return (
        isPreparationPriority(item.priority) &&
        typeof item.title === "string" &&
        typeof item.action === "string" &&
        typeof item.reason === "string"
      );
    }) ||
    !recommendedShelter ||
    typeof recommendedShelter !== "object" ||
    typeof advice.routeExplanation !== "string" ||
    typeof advice.disclaimer !== "string"
  ) {
    return false;
  }

  const shelter = recommendedShelter as Record<string, unknown>;
  if (
    shelter.shelterId !== null &&
    (typeof shelter.shelterId !== "number" ||
      !routeCandidates.some((route) => route.shelter.id === shelter.shelterId))
  ) {
    return false;
  }

  return typeof shelter.reason === "string";
}

function toRiskAnalysisResult(analysis: {
  vulnerabilityScore: number;
  category: string;
  freqPerYear: number;
  m5Count: number;
  maxMagnitude: number;
  avgDepthKm: number;
  nearestM5DistanceKm: number;
}): RiskAnalysisResult {
  return {
    vulnerabilityScore: analysis.vulnerabilityScore,
    category: analysis.category,
    features: {
      freqPerYear: analysis.freqPerYear,
      m5Count: analysis.m5Count,
      maxMagnitude: analysis.maxMagnitude,
      avgDepthKm: analysis.avgDepthKm,
      nearestM5DistanceKm: analysis.nearestM5DistanceKm,
    },
  };
}

export async function POST(request: NextRequest) {
  let analysisId: number | null = null;

  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json(
        { error: "Silakan login untuk mendapatkan analisis Gemini." },
        { status: 401 },
      );
    }

    const body = await request.json();
    analysisId = typeof body.analysisId === "number" ? body.analysisId : null;
    if (analysisId === null) {
      return NextResponse.json(
        { error: "analysisId wajib diisi." },
        { status: 400 },
      );
    }

    const analysis = await prisma.riskAnalysis.findFirst({
      where: { id: analysisId, userId: user.id },
    });
    if (!analysis) {
      return NextResponse.json(
        { error: "Analisis risiko tidak ditemukan." },
        { status: 404 },
      );
    }

    const routeCandidates = Array.isArray(body.routeCandidates)
      ? (body.routeCandidates as RouteSnapshot[])
      : [];
    await prisma.geminiAdvice.upsert({
      where: { riskAnalysisId: analysis.id },
      create: { riskAnalysisId: analysis.id, status: "PENDING" },
      update: { status: "PENDING", errorMessage: null },
    });

    const mlResult = toRiskAnalysisResult(analysis);
    const locationName = analysis.locationName ?? "Lokasi analisis";
    const routeContext = routeCandidates.length
      ? JSON.stringify(routeCandidates)
      : "Tidak ada shelter resmi dan rute terverifikasi yang tersedia.";

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: `
Analisis hasil Machine Learning untuk ${locationName} (${analysis.latitude}, ${analysis.longitude}).

HASIL ML (jangan ubah angka ini):
${JSON.stringify(mlResult)}

KANDIDAT SHELTER DAN RUTE DARI SERVER (jangan membuat kandidat baru):
${routeContext}

Buat penjelasan dalam Bahasa Indonesia. Jika skor sekitar 50, jelaskan persiapan tingkat sedang secara konkret. Jika tidak ada kandidat shelter, isi shelterId dengan null dan jelaskan bahwa pengguna harus mengikuti arahan BPBD/BNPB/petugas setempat.
`,
      config: {
        systemInstruction: `
Kamu adalah pakar mitigasi gempa SIGAP AI. Output harus mengikuti JSON schema.
Skor dan fitur ML adalah fakta yang tidak boleh diubah atau dihitung ulang.
Jangan membuat koordinat, nama shelter, jarak, durasi, atau rute baru.
Hanya pilih shelterId dari kandidat yang diberikan server.
Tekankan bahwa hasil ini adalah estimasi historis, bukan prediksi waktu gempa.
`,
        responseMimeType: "application/json",
        responseJsonSchema: geminiResponseSchema,
      },
    });

    const structuredAdvice = JSON.parse(response.text ?? "");
    if (!isGeminiStructuredAdvice(structuredAdvice, routeCandidates)) {
      throw new Error("Respons Gemini tidak sesuai structured output.");
    }

    const savedAdvice = await prisma.geminiAdvice.update({
      where: { riskAnalysisId: analysis.id },
      data: {
        status: "COMPLETED",
        structuredOutput: structuredAdvice as unknown as Prisma.InputJsonValue,
        rawResponse: structuredAdvice as unknown as Prisma.InputJsonValue,
        errorMessage: null,
      },
    });

    return NextResponse.json({
      success: true,
      adviceId: savedAdvice.id,
      aiAdvice: structuredAdvice,
    });
  } catch (error) {
    console.error("Error pada API Gemini:", error);
    if (analysisId !== null) {
      await prisma.geminiAdvice.upsert({
        where: { riskAnalysisId: analysisId },
        create: {
          riskAnalysisId: analysisId,
          status: "FAILED",
          errorMessage: "Structured output Gemini gagal dibuat.",
        },
        update: {
          status: "FAILED",
          errorMessage: "Structured output Gemini gagal dibuat.",
        },
      });
    }

    return NextResponse.json(
      {
        error:
          "Saran Gemini belum tersedia. Hasil analisis risiko tetap tersimpan.",
      },
      { status: 500 },
    );
  }
}
