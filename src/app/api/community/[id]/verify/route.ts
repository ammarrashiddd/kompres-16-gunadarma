import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/server-auth";

interface RouteContext {
  params: Promise<{ id: string }>;
}

// ─────────────────────────────────────────────────────────────
// POST /api/community/[id]/verify
// Konfirmasi / Verifikasi Laporan dari Warga Sekitar (Crowdsourcing)
// Menambah verifiedCount + 1
// ─────────────────────────────────────────────────────────────
export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Silakan login untuk memverifikasi laporan ini.",
        },
        { status: 401 },
      );
    }

    const { id } = await context.params;
    const postId = parseInt(id, 10);

    if (Number.isNaN(postId)) {
      return NextResponse.json(
        { success: false, message: "ID laporan tidak valid." },
        { status: 400 },
      );
    }

    const post = await prisma.communityPost.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return NextResponse.json(
        { success: false, message: "Laporan tidak ditemukan." },
        { status: 404 },
      );
    }

    const updated = await prisma.communityPost.update({
      where: { id: postId },
      data: {
        verifiedCount: {
          increment: 1,
        },
      },
      select: {
        id: true,
        verifiedCount: true,
      },
    });

    return NextResponse.json({
      success: true,
      message:
        "Terima kasih! Verifikasi Anda membantu warga lain mendapatkan info valid.",
      data: updated,
    });
  } catch (error) {
    console.error("[POST /api/community/[id]/verify error]:", error);
    return NextResponse.json(
      { success: false, message: "Gagal memverifikasi laporan." },
      { status: 500 },
    );
  }
}
