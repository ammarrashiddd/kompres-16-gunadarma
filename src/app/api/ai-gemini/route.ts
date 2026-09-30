import { GoogleGenAI } from "@google/genai";
import type { Prisma } from "@prisma/client";
import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/server-auth";
import type { GeminiStructuredAdvice, RiskAnalysisResult } from "@/types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const geminiResponseSchema = {
  type: "object",
  properties: {
    summary: { type: "string" },
    riskInterpretation: { type: "string" },
    keyFactors: {
      type: "array",
      minItems: 6,
      maxItems: 6,
      items: { type: "string" },
    },
    disclaimer: { type: "string" },
  },
  required: ["summary", "riskInterpretation", "keyFactors", "disclaimer"],
} as const;

function isGeminiStructuredAdvice(
  value: unknown,
): value is GeminiStructuredAdvice {
  if (!value || typeof value !== "object") return false;

  const advice = value as Record<string, unknown>;

  if (
    typeof advice.summary !== "string" ||
    typeof advice.riskInterpretation !== "string" ||
    !Array.isArray(advice.keyFactors) ||
    !advice.keyFactors.every((factor) => typeof factor === "string") ||
    typeof advice.disclaimer !== "string"
  ) {
    return false;
  }

  return true;
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

    await prisma.geminiAdvice.upsert({
      where: { riskAnalysisId: analysis.id },
      create: { riskAnalysisId: analysis.id, status: "PENDING" },
      update: { status: "PENDING", errorMessage: null },
    });

    const mlResult = toRiskAnalysisResult(analysis);
    const locationName = analysis.locationName ?? "Lokasi analisis";

    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite",
      contents: `
    Jelaskan hasil analisis risiko gempa untuk ${locationName} kepada orang awam yang tidak memahami istilah Machine Learning atau seismologi. Lokasi analisis: ${analysis.latitude}, ${analysis.longitude}.

    HASIL ML (gunakan sebagai fakta dan jangan ubah, hitung ulang, atau menambahkan angka baru):
${JSON.stringify(mlResult)}

    Buat penjelasan dalam Bahasa Indonesia yang rinci, beralasan, tetapi tetap mudah dibaca dan tidak menakut-nakuti. Summary harus terdiri dari 5-6 kalimat: sebutkan hasil utama, arti kategori bagi lokasi tersebut, alasan umum yang terlihat dari data, dan batasan makna hasilnya bagi pengguna. Risk interpretation harus terdiri dari 4-5 kalimat yang menjelaskan hubungan skor dengan kategori, mengapa hasilnya berada pada tingkat tersebut berdasarkan data yang tersedia, apa yang bisa dan tidak bisa disimpulkan, serta bagaimana pengguna sebaiknya memahami hasil itu. Key factors harus berisi tepat 6 poin: satu poin untuk skor/kategori dan satu poin untuk masing-masing dari lima fitur ML. Setiap poin wajib menyebut angka aslinya, menjelaskan arti angka dengan bahasa awam, lalu memberikan alasan mengapa angka tersebut relevan terhadap penilaian risiko. Gunakan satuan yang jelas dan hindari jargon tanpa penjelasan.
`,
      config: {
        systemInstruction: `
    Kamu adalah penerjemah hasil analisis risiko gempa SIGAP AI untuk masyarakat umum, bukan pembuat skor baru. Output harus mengikuti JSON schema.

    Aturan wajib:
    - Skor kerentanan, kategori, dan seluruh fitur ML adalah fakta. Jangan mengubah, membulatkan secara menyesatkan, menghitung ulang, atau membuat angka/ambang baru.
    - Jelaskan istilah teknis dengan bahasa sehari-hari. Contoh: magnitudo adalah ukuran kekuatan gempa, kedalaman adalah seberapa jauh pusat gempa dari permukaan, dan jarak adalah perkiraan jarak dari lokasi analisis ke gempa terdekat.
    - summary harus menjadi ringkasan 5-6 kalimat yang langsung menjawab: "Apa arti hasil ini bagi saya?" Setiap kesimpulan penting harus disertai alasan yang dapat ditelusuri ke data ML.
    - riskInterpretation harus terdiri dari 4-5 kalimat. Jelaskan alasan kategori secara hati-hati berdasarkan pola data, bukan berdasarkan dugaan kondisi bangunan atau prediksi masa depan.
    - keyFactors harus berisi tepat 6 poin: skor/kategori, frekuensi per tahun, jumlah gempa M 5 atau lebih, magnitudo maksimum, kedalaman rata-rata, dan jarak gempa M 5 atau lebih terdekat. Setiap poin harus memuat format "angka -> arti sederhana -> alasan relevan" dan tidak boleh hanya menyalin nama field.
    - Jangan memberikan langkah persiapan, daftar tindakan, atau rekomendasi mitigasi dalam output ini. Fokus hanya pada penerjemahan dan penjelasan hasil analisis.
    - Jangan menakut-nakuti, menjanjikan keselamatan, atau menyatakan kapan gempa akan terjadi.
    - Tekankan bahwa hasil ini adalah estimasi berdasarkan pola historis/statistik, bukan prediksi waktu terjadinya gempa. Pengguna tetap harus mengikuti arahan BMKG, BNPB/BPBD, dan petugas setempat.
`,
        responseMimeType: "application/json",
        responseJsonSchema: geminiResponseSchema,
      },
    });

    const structuredAdvice = JSON.parse(response.text ?? "");
    if (!isGeminiStructuredAdvice(structuredAdvice)) {
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
