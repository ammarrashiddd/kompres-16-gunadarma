import type { Prisma } from "@prisma/client";
import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/server-auth";

const VALID_DAMAGE_LEVELS = ["RINGAN", "SEDANG", "BERAT", "DARURAT"] as const;
type DamageLevel = (typeof VALID_DAMAGE_LEVELS)[number];

interface RouteContext {
  params: Promise<{ id: string }>;
}

// ─────────────────────────────────────────────────────────────
// GET /api/community/[id]
// Detail satu laporan komunitas
// ─────────────────────────────────────────────────────────────
export async function GET(_request: NextRequest, context: RouteContext) {
  try {
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
      include: {
        user: {
          select: {
            id: true,
            nama: true,
            avatar: true,
          },
        },
      },
    });

    if (!post) {
      return NextResponse.json(
        { success: false, message: "Laporan tidak ditemukan." },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: post,
    });
  } catch (error) {
    console.error("[GET /api/community/[id] error]:", error);
    return NextResponse.json(
      { success: false, message: "Gagal mengambil data laporan." },
      { status: 500 },
    );
  }
}

// ─────────────────────────────────────────────────────────────
// PUT /api/community/[id]
// Mengedit laporan (Hanya pembuat postingan)
// ─────────────────────────────────────────────────────────────
export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Tidak terautentikasi." },
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

    // Cek keberadaan postingan & kepemilikan
    const existingPost = await prisma.communityPost.findUnique({
      where: { id: postId },
    });

    if (!existingPost) {
      return NextResponse.json(
        { success: false, message: "Laporan tidak ditemukan." },
        { status: 404 },
      );
    }

    if (existingPost.userId !== user.id) {
      return NextResponse.json(
        {
          success: false,
          message: "Anda tidak memiliki izin untuk mengedit laporan ini.",
        },
        { status: 403 },
      );
    }

    const body = await request.json();
    const {
      title,
      description,
      locationName,
      damageLevel,
      imageUrl,
      latitude,
      longitude,
    } = body;

    const updateData: Prisma.CommunityPostUpdateInput = {};

    if (typeof title === "string" && title.trim().length >= 3) {
      updateData.title = title.trim();
    }
    if (typeof description === "string" && description.trim().length >= 5) {
      updateData.description = description.trim();
    }
    if (typeof locationName === "string" && locationName.trim().length >= 2) {
      updateData.locationName = locationName.trim();
    }
    if (damageLevel) {
      const norm = damageLevel.toString().toUpperCase();
      if (VALID_DAMAGE_LEVELS.includes(norm as DamageLevel)) {
        updateData.damageLevel = norm;
      }
    }
    if (imageUrl !== undefined) {
      updateData.imageUrl =
        typeof imageUrl === "string" && imageUrl.trim()
          ? imageUrl.trim()
          : null;
    }
    if (typeof latitude === "number") updateData.latitude = latitude;
    if (typeof longitude === "number") updateData.longitude = longitude;

    const updatedPost = await prisma.communityPost.update({
      where: { id: postId },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            nama: true,
            avatar: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Laporan berhasil diperbarui.",
      data: updatedPost,
    });
  } catch (error) {
    console.error("[PUT /api/community/[id] error]:", error);
    return NextResponse.json(
      { success: false, message: "Gagal memperbarui laporan." },
      { status: 500 },
    );
  }
}

// ─────────────────────────────────────────────────────────────
// DELETE /api/community/[id]
// Menghapus laporan (Hanya pembuat postingan)
// ─────────────────────────────────────────────────────────────
export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Tidak terautentikasi." },
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

    const existingPost = await prisma.communityPost.findUnique({
      where: { id: postId },
    });

    if (!existingPost) {
      return NextResponse.json(
        { success: false, message: "Laporan tidak ditemukan." },
        { status: 404 },
      );
    }

    if (existingPost.userId !== user.id) {
      return NextResponse.json(
        {
          success: false,
          message: "Anda tidak memiliki izin untuk menghapus laporan ini.",
        },
        { status: 403 },
      );
    }

    await prisma.communityPost.delete({
      where: { id: postId },
    });

    return NextResponse.json({
      success: true,
      message: "Laporan berhasil dihapus.",
    });
  } catch (error) {
    console.error("[DELETE /api/community/[id] error]:", error);
    return NextResponse.json(
      { success: false, message: "Gagal menghapus laporan." },
      { status: 500 },
    );
  }
}
