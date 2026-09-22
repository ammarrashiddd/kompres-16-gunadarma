import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

// Inisialisasi Google GenAI SDK
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Simulasi panggilan model Machine Learning
async function runMachineLearningModel(_lat: number, _lon: number) {
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

export async function POST(request: Request) {
  try {
    const { lat, lon, locationName } = await request.json();

    if (typeof lat !== "number" || typeof lon !== "number") {
      return NextResponse.json(
        { error: "Koordinat lat dan lon wajib diisi" },
        { status: 400 },
      );
    }

    // 1. Ambil data hasil ML
    const mlResult = await runMachineLearningModel(lat, lon);

    // 2. Susun System Instruction & Input Prompt
    const systemInstruction = `
Kamu adalah pakar mitigasi bencana gempa bumi dari SIGAP AI.
Tugas utama: Memberikan analisis singkat dan saran aksi praktis berdasarkan data numerik hasil prediksi Machine Learning.

PRINSIP WAJIB:
1. Dilarang mengubah, menambah, atau memprediksi angka skor kerentanan baru. Gunakan data angka persis seperti yang diberikan.
2. Jelaskan faktor utama pemicu risiko (misal: tingginya persentase gempa dangkal atau frekuensi tahunan).
3. Berikan 3 poin tindakan mitigasi/persiapan yang paling relevan untuk warga setempat.
4. Gunakan bahasa Indonesia yang tegas, tenang, lugas, dan mudah dipahami.
`;

    const userPrompt = `
Berikut adalah hasil analisis data Machine Learning untuk daerah: **${locationName || "Bekasi & Sekitarnya"}** (Lat: ${lat}, Lon: ${lon}):

- Skor Kerentanan: ${mlResult.vulnerabilityScore} / 100 (${mlResult.category})
- Frekuensi Gempa Historis: ${mlResult.features.freqPerYear} kali/tahun (Radius 100 km)
- Kejadian Gempa M >= 5.0: ${mlResult.features.m5Count} kali
- Magnitudo Maksimum Historis: M ${mlResult.features.maxMagnitude}
- Rata-rata Kedalaman Pusat Gempa: ${mlResult.features.avgDepthKm} km
- Jarak Gempa Signifikan Terdekat: ${mlResult.features.nearestM5DistanceKm} km

Berikan penjelasan singkat mengenai angka risiko ini dan saran mitigasi yang konkret.
`;

    // 3. Panggil Gemini menggunakan Interactions API
    const interaction = await ai.interactions.create({
      model: "gemini-3.6-flash",
      input: userPrompt,
      system_instruction: systemInstruction,
      store: false, // Set false jika hanya butuh permohonan sekali jalan (stateless)
    });

    // Ambil hasil teks dari objek interaction
    const aiAdvice = interaction.output_text;

    // 4. Kembalikan response gabungan ke Client
    return NextResponse.json({
      success: true,
      location: locationName,
      mlResult,
      aiAdvice,
      interactionId: interaction.id, // ID interaksi jika store=true
    });
  } catch (error) {
    console.error("Error pada API Risk Analysis:", error);
    return NextResponse.json(
      { error: "Gagal memproses analisis risiko dan rekomendasi AI" },
      { status: 500 },
    );
  }
}
