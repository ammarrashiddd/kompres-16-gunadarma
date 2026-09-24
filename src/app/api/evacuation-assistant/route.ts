import { GoogleGenAI } from "@google/genai";
import { type NextRequest, NextResponse } from "next/server";

export type UserSituation =
  | "indoor"
  | "highrise"
  | "outdoor"
  | "coastal"
  | "driving";

export interface EvacuationRequestBody {
  magnitude?: number;
  depthKm?: number;
  distanceKm?: number;
  userSituation?: UserSituation;
  specialConditions?: string[];
  locationName?: string;
}

export interface EvacuationGuidance {
  urgencyLevel: "DARURAT" | "WASPADA" | "SIAGA" | "AMAN";
  headline: string;
  immediateActions: string[];
  hazardWarnings: string[];
  itemsToBring: string[];
  evacuationDirection: string;
  emergencyContacts: Array<{
    name: string;
    number: string;
    description: string;
  }>;
  disclaimer: string;
  source: "ai" | "protocol_fallback";
}

// ─────────────────────────────────────────────────────────────
// Rule-Based Deterministic Safety Fallback (Standard BNPB)
// Wajib selalu ada agar sistem 100% reliable kapanpun dibutuhkan
// ─────────────────────────────────────────────────────────────
function generateFallbackGuidance(
  params: EvacuationRequestBody,
): EvacuationGuidance {
  const {
    magnitude = 5.0,
    depthKm = 10,
    distanceKm = 30,
    userSituation = "indoor",
    specialConditions = [],
    locationName = "Lokasi Anda",
  } = params;

  let urgencyLevel: "DARURAT" | "WASPADA" | "SIAGA" | "AMAN" = "WASPADA";
  if (magnitude >= 6.5 || (magnitude >= 5.5 && distanceKm <= 30)) {
    urgencyLevel = "DARURAT";
  } else if (magnitude < 4.5 && distanceKm > 100) {
    urgencyLevel = "AMAN";
  } else if (magnitude < 5.0) {
    urgencyLevel = "SIAGA";
  }

  const immediateActions: string[] = [];
  const hazardWarnings: string[] = [];

  // Tindakan berdasarkan situasi fisik pengguna
  switch (userSituation) {
    case "indoor":
      immediateActions.push(
        "LINDUNGI DIRI: Merunduk, lindungi kepala di bawah meja kokoh (Drop, Cover, Hold On).",
      );
      immediateActions.push(
        "Jauhi jendela kaca, cermin, lemari tinggi, dan partisi yang berpotensi roboh.",
      );
      immediateActions.push(
        "Tunggu hingga guncangan benar-benar reda sebelum melangkah keluar bangunan.",
      );
      immediateActions.push(
        "Gunakan tangga darurat secara tertib. DILARANG KERAS MENGGUNAKAN LIFT.",
      );
      hazardWarnings.push(
        "Jangan panik berebut keluar saat gempa masih berlangsung.",
      );
      hazardWarnings.push(
        "Waspadai pecahan kaca dan barang jatuh dari langit-langit.",
      );
      break;

    case "highrise":
      immediateActions.push(
        "TETAP DI DALAM RUANGAN: Merunduk dan lindungi kepala di samping pilar struktural atau di bawah meja.",
      );
      immediateActions.push(
        "JAUHI KACA & BALKON: Hindari perimeter luar gedung.",
      );
      immediateActions.push(
        "Jangan gunakan lift sama sekali — lift berisiko macet dan mati listrik seketika.",
      );
      immediateActions.push(
        "Setelah guncangan berhenti, evakuasi tenang lewat tangga darurat menuju titik kumpul terbuka.",
      );
      hazardWarnings.push(
        "Lift adalah perangkap maut saat gempa. Selalu gunakan tangga darurat.",
      );
      hazardWarnings.push(
        "Waspada alarm kebakaran dan sistem sprinkler yang mungkin terpicu otomatis.",
      );
      break;

    case "coastal":
      if (magnitude >= 6.0 || depthKm <= 50) {
        immediateActions.push(
          "WASPADA TSUNAMI: SEGERA EVAKUASI KE DATARAN TINGGI (minimal 20 meter dpl) atau bangunan evakuasi vertikal!",
        );
        immediateActions.push(
          "JAUHI BIBIR PANTAI sekarang juga tanpa menunggu sirine peringatan resmi!",
        );
        immediateActions.push(
          "Berjalan cepat atau lari ke tempat tinggi, hindari menggunakan mobil jika jalanan berpotensi macet.",
        );
      } else {
        immediateActions.push(
          "Menjauh dari bibir pantai dan muara sungai ke area yang lebih tinggi.",
        );
        immediateActions.push(
          "Pantau terus informasi peringatan dini tsunami dari BMKG.",
        );
      }
      hazardWarnings.push(
        "Gelombang pertama tsunami bukan selalu yang terbesar.",
      );
      hazardWarnings.push(
        "Jangan pernah mendekati pantai untuk melihat air surut.",
      );
      break;

    case "driving":
      immediateActions.push(
        "Kurangi kecepatan perlahan dan tepikan kendaraan di bahu jalan yang aman.",
      );
      immediateActions.push(
        "TETAP DI DALAM MOBIL hingga guncangan gempa berhenti total.",
      );
      immediateActions.push(
        "Nyalakan lampu hazard untuk memberi tanda pengendara lain.",
      );
      immediateActions.push("Tarik rem tangan dan matikan mesin.");
      hazardWarnings.push(
        "HINDARI berhenti di bawah atau di atas jembatan layang, papan baliho, dan kabel listrik.",
      );
      break;

    case "outdoor":
      immediateActions.push(
        "Tetap di luar ruangan di area lapang yang luas (lapangan, taman).",
      );
      immediateActions.push(
        "Merunduk dan lindungi kepala dengan tas atau kedua tangan.",
      );
      immediateActions.push(
        "Tetap di titik aman hingga keadaan dipastikan stabil.",
      );
      hazardWarnings.push(
        "JAUHI tiang listrik, pohon besar, baliho reklame, dan dinding pagar bata.",
      );
      break;
  }

  // Penanganan kondisi khusus
  if (
    specialConditions.includes("ada_lansia") ||
    specialConditions.includes("ada_disabilitas")
  ) {
    immediateActions.push(
      "Bantu mobilisasi lansia/penyandang disabilitas ke titik aman terdekat tanpa terburu-buru yang membahayakan.",
    );
  }
  if (specialConditions.includes("ada_bayi")) {
    immediateActions.push(
      "Dekap bayi erat di dada dan lindungi bagian kepala serta leher dengan lengan atau kain tebal.",
    );
  }

  const itemsToBring = [
    "Air minum botol & makanan ringan tahan lama",
    "Kotak P3K & obat-obatan pribadi/rutin",
    "Ponsel & power bank darurat",
    "Dokumen penting dalam tas kedap air",
    "Senter / penerangan darurat & peluit",
    "Uang tunai secukupnya",
  ];

  const emergencyContacts = [
    {
      name: "Panggilan Darurat Terpadu",
      number: "112",
      description: "Bebas pulsa, darurat medis & bencana",
    },
    {
      name: "Basarnas (Pencarian & Pertolongan)",
      number: "115",
      description: "Evakuasi SAR korban bencana",
    },
    {
      name: "BNPB / BPBD",
      number: "117",
      description: "Pusat Pengendalian Operasi Penanggulangan Bencana",
    },
    {
      name: "Ambulans Gawat Darurat",
      number: "119",
      description: "Pertolongan medis darurat",
    },
    {
      name: "Polisi",
      number: "110",
      description: "Bantuan keamanan & evakuasi wilayah",
    },
  ];

  return {
    urgencyLevel,
    headline:
      urgencyLevel === "DARURAT"
        ? "🚨 TINDAKAN DETIK INI: LINDUNGI KEPALA SEGERA (DROP, COVER, HOLD ON)!"
        : "⚠️ TETAP SIAGA & WASPADA TERHADAP POTENSI GEMPA SUSULAN",
    immediateActions,
    hazardWarnings,
    itemsToBring,
    evacuationDirection:
      userSituation === "coastal"
        ? `Segera bergerak menuju dataran tinggi terdekat dari ${locationName}.`
        : `Menuju area terbuka luas yang bebas dari reruntuhan bangunan di sekitar ${locationName}.`,
    emergencyContacts,
    disclaimer:
      "Instruksi ini adalah panduan kesiapsiagaan darurat berdasarkan protokol keselamatan bencana resmi BNPB/BPBD. Selalu prioritaskan arahan langsung petugas otoritas di lapangan.",
    source: "protocol_fallback",
  };
}

// ─────────────────────────────────────────────────────────────
// POST /api/evacuation-assistant
// Panduan Evakuasi Real-time ("What to do RIGHT NOW")
// ─────────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  let body: EvacuationRequestBody = {};
  try {
    body = await request.json();
  } catch {
    // Default empty if not valid JSON
  }

  const fallback = generateFallbackGuidance(body);

  // Jika GEMINI_API_KEY tidak dikonfigurasi, gunakan fallback protokol BNPB langsung
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({
      success: true,
      data: fallback,
    });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    const systemInstruction = `
Kamu adalah Sistem Asisten Evakuasi Darurat Bencana Gempa Bumi dari SIGAP/GTek.
Tugasmu: Memberikan panduan aksi LANGSUNG ("What to do RIGHT NOW") saat atau sesaat setelah gempa terjadi.

PRINSIP KESELAMATAN MUTLAK (GUARDRAILS):
1. DILARANG KERAS menyarankan penggunaan lift.
2. DILARANG menyarankan kembali ke dalam bangunan yang sudah retak/rusak.
3. Utamakan keselamatan fisik seketika (Drop, Cover, Hold On) sebelum memikirkan barang bawaan.
4. Jika di daerah pantai dan gempa kuat (> M 6.0 atau guncangan > 20 detik), wajib perintahkan lari ke dataran tinggi untuk antisipasi tsunami.
5. Format output HARUS berupa JSON valid tanpa teks pengantar di luar JSON.

Format JSON yang wajib kamu hasilkan:
{
  "urgencyLevel": "DARURAT" | "WASPADA" | "SIAGA" | "AMAN",
  "headline": "Kalimat perintah tegas detik ini (misal: LINDUNGI KEPALA SEGERA - DROP, COVER, HOLD ON)",
  "immediateActions": ["tindakan 1", "tindakan 2", "tindakan 3", "tindakan 4"],
  "hazardWarnings": ["bahaya 1 yang dilarang", "bahaya 2"],
  "itemsToBring": ["barang 1", "barang 2", "barang 3"],
  "evacuationDirection": "arahan arah evakuasi konkret",
  "disclaimer": "Ikuti selalu arahan petugas resmi BPBD/BNPB di lapangan."
}
`;

    const userPrompt = `
Berikan instruksi evakuasi darurat detik ini juga untuk kondisi berikut:
- Lokasi: ${body.locationName || "Wilayah terdampak"}
- Magnitudo Gempa: ${body.magnitude || 5.0} SR
- Kedalaman Gempa: ${body.depthKm || 10} km
- Jarak ke Pusat Gempa: ${body.distanceKm || 30} km
- Posisi Pengguna: ${body.userSituation || "indoor"}
- Kondisi Tambahan: ${body.specialConditions?.length ? body.specialConditions.join(", ") : "Tidak ada"}
`;

    const interaction = await ai.interactions.create({
      model: "gemini-3.6-flash",
      input: userPrompt,
      system_instruction: systemInstruction,
      store: false,
    });

    const rawText = interaction.output_text?.trim() || "";

    // Bersihkan codeblock markdown jika ada (misal ```json ... ```)
    const cleanedJson = rawText
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/```$/i, "")
      .trim();

    const parsed = JSON.parse(cleanedJson);

    const mergedData: EvacuationGuidance = {
      urgencyLevel: parsed.urgencyLevel || fallback.urgencyLevel,
      headline: parsed.headline || fallback.headline,
      immediateActions:
        Array.isArray(parsed.immediateActions) &&
        parsed.immediateActions.length > 0
          ? parsed.immediateActions
          : fallback.immediateActions,
      hazardWarnings:
        Array.isArray(parsed.hazardWarnings) && parsed.hazardWarnings.length > 0
          ? parsed.hazardWarnings
          : fallback.hazardWarnings,
      itemsToBring:
        Array.isArray(parsed.itemsToBring) && parsed.itemsToBring.length > 0
          ? parsed.itemsToBring
          : fallback.itemsToBring,
      evacuationDirection:
        parsed.evacuationDirection || fallback.evacuationDirection,
      emergencyContacts: fallback.emergencyContacts,
      disclaimer: parsed.disclaimer || fallback.disclaimer,
      source: "ai",
    };

    return NextResponse.json({
      success: true,
      data: mergedData,
    });
  } catch (err) {
    console.warn(
      "[/api/evacuation-assistant]: Gemini call failed or timeout, using BNPB fallback:",
      err,
    );
    // Kembalikan fallback BNPB secara transparan jika AI gagal atau format tidak valid
    return NextResponse.json({
      success: true,
      data: fallback,
    });
  }
}
