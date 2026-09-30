import type { Prisma, RiskCategory } from "@prisma/client";
import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/server-auth";
import type { GeminiStructuredAdvice, RiskAnalysisResult } from "@/types";

// Simulasi panggilan model Machine Learning
async function runMachineLearningModel(
  _lat: number,
  _lon: number,
): Promise<RiskAnalysisResult> {
  return {
    vulnerabilityScore: 72.0,
    category: "Sedang-Tinggi",
    features: {
      freqPerYear: 51.0,
      m5Count: 10,
      maxMagnitude: 5.8,
      avgDepthKm: 32.8,
      nearestM5DistanceKm: 68.2,
    },
  };
}

function toRiskCategory(category: string): RiskCategory {
  switch (category.toUpperCase().replaceAll("-", "_")) {
    case "RENDAH":
      return "RENDAH";
    case "SEDANG":
      return "SEDANG";
    case "TINGGI":
      return "TINGGI";
    case "SANGAT_TINGGI":
      return "SANGAT_TINGGI";
    default:
      return "SEDANG_TINGGI";
  }
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
    category: analysis.category.replaceAll("_", "-"),
    features: {
      freqPerYear: analysis.freqPerYear,
      m5Count: analysis.m5Count,
      maxMagnitude: analysis.maxMagnitude,
      avgDepthKm: analysis.avgDepthKm,
      nearestM5DistanceKm: analysis.nearestM5DistanceKm,
    },
  };
}

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json(
        { error: "Silakan login untuk melihat riwayat analisis." },
        { status: 401 },
      );
    }

    const analysis = await prisma.riskAnalysis.findFirst({
      where: { userId: user.id, locationName: user.cityName },
      orderBy: { createdAt: "desc" },
      include: { geminiAdvice: true },
    });

    if (!analysis) {
      return NextResponse.json(
        { error: "Belum ada analisis yang tersimpan." },
        { status: 404 },
      );
    }

    const storedAdvice = analysis.geminiAdvice?.structuredOutput;
    const aiAdvice =
      analysis.geminiAdvice?.status === "COMPLETED" && storedAdvice
        ? (storedAdvice as unknown as GeminiStructuredAdvice)
        : null;

    return NextResponse.json({
      success: true,
      analysisId: analysis.id,
      location: analysis.locationName,
      mlResult: toRiskAnalysisResult(analysis),
      aiAdvice,
    });
  } catch (error) {
    console.error("Error mengambil riwayat Risk Analysis:", error);
    return NextResponse.json(
      { error: "Gagal mengambil analisis tersimpan." },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json(
        { error: "Silakan login untuk menyimpan analisis risiko." },
        { status: 401 },
      );
    }

    if (
      user.cityName === null ||
      user.cityLatitude === null ||
      user.cityLongitude === null
    ) {
      return NextResponse.json(
        {
          error: "Pilih kota di halaman profile sebelum menjalankan analisis.",
          code: "CITY_REQUIRED",
        },
        { status: 400 },
      );
    }

    const mlResult = await runMachineLearningModel(
      user.cityLatitude,
      user.cityLongitude,
    );
    const analysis = await prisma.riskAnalysis.create({
      data: {
        userId: user.id,
        locationName: user.cityName,
        latitude: user.cityLatitude,
        longitude: user.cityLongitude,
        vulnerabilityScore: mlResult.vulnerabilityScore,
        category: toRiskCategory(mlResult.category),
        freqPerYear: mlResult.features.freqPerYear,
        m5Count: mlResult.features.m5Count,
        maxMagnitude: mlResult.features.maxMagnitude,
        avgDepthKm: mlResult.features.avgDepthKm,
        nearestM5DistanceKm: mlResult.features.nearestM5DistanceKm,
        modelVersion: "v1",
        rawMlOutput: mlResult as unknown as Prisma.InputJsonValue,
      },
    });

    return NextResponse.json({
      success: true,
      analysisId: analysis.id,
      location: user.cityName,
      mlResult,
    });
  } catch (error) {
    console.error("Error pada API Risk Analysis:", error);
    return NextResponse.json(
      { error: "Gagal memproses analisis risiko" },
      { status: 500 },
    );
  }
}
