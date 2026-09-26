import { NextResponse } from "next/server";
import { getKotaPilihan } from "@/lib/namaDaerah/kotaPilihan";

export async function GET() {
  try {
    const kotaPilihan = await getKotaPilihan();
    return NextResponse.json({ success: true, data: kotaPilihan });
  } catch (error) {
    console.error("Gagal membaca daftar kota:", error);
    return NextResponse.json(
      { success: false, message: "Gagal memuat daftar kota." },
      { status: 500 },
    );
  }
}
