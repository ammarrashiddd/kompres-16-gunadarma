import type { Prisma, RiskCategory } from "@prisma/client";
import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/server-auth";
import type { RiskAnalysisResult } from "@/types";

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

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json(
        { error: "Silakan login untuk menyimpan analisis risiko." },
        { status: 401 },
      );
    }

    const { lat, lon, locationName } = await request.json();

    if (
      typeof lat !== "number" ||
      typeof lon !== "number" ||
      lat < -90 ||
      lat > 90 ||
      lon < -180 ||
      lon > 180
    ) {
      return NextResponse.json(
        { error: "Koordinat lat dan lon valid wajib diisi" },
        { status: 400 },
      );
    }

    const mlResult = await runMachineLearningModel(lat, lon);
    const analysis = await prisma.riskAnalysis.create({
      data: {
        userId: user.id,
        locationName: typeof locationName === "string" ? locationName : null,
        latitude: lat,
        longitude: lon,
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
      location: locationName,
      mlResult,
      routeCandidates: [],
    });
  } catch (error) {
    console.error("Error pada API Risk Analysis:", error);
    return NextResponse.json(
      { error: "Gagal memproses analisis risiko" },
      { status: 500 },
    );
  }
}
