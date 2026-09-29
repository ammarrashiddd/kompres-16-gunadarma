import type { Prisma } from "@prisma/client";
import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/server-auth";
import { findKotaPilihan } from "@/lib/namaDaerah/kotaPilihan";

const VALID_DAMAGE_LEVELS = ["RINGAN", "SEDANG", "BERAT", "DARURAT"] as const;
type DamageLevel = (typeof VALID_DAMAGE_LEVELS)[number];

// ─────────────────────────────────────────────────────────────
// GET /api/community
// Mengambil daftar laporan/postingan komunitas
// Query params:
//   - search: string (filter teks di title, description, locationName)
//   - damageLevel: "RINGAN" | "SEDANG" | "BERAT" | "DARURAT"
//   - sortBy: "recent" (default) | "verified"
//   - limit: number (default 50)
// ─────────────────────────────────────────────────────────────
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search")?.trim();
    const damageLevel = searchParams.get("damageLevel")?.trim().toUpperCase();
    const sortBy = searchParams.get("sortBy")?.trim() || "recent";
    const limit = Math.min(
      Math.max(Number(searchParams.get("limit") || 50), 1),
      100,
    );

    const whereClause: Prisma.CommunityPostWhereInput = {};

    // Filter Search
    if (search) {
      whereClause.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { locationName: { contains: search, mode: "insensitive" } },
      ];
    }

    // Filter Tingkat Kerusakan
    if (
      damageLevel &&
      VALID_DAMAGE_LEVELS.includes(damageLevel as DamageLevel)
    ) {
      whereClause.damageLevel = damageLevel;
    }

    // Sorting
    const orderBy: Prisma.CommunityPostOrderByWithRelationInput[] =
      sortBy === "verified"
        ? [{ verifiedCount: "desc" }, { createdAt: "desc" }]
        : [{ createdAt: "desc" }];

    const [posts, user] = await Promise.all([
      prisma.communityPost.findMany({
        where: whereClause,
        orderBy,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              nama: true,
              avatar: true,
            },
          },
        },
      }),
      getAuthenticatedUser(request),
    ]);

    return NextResponse.json({
      success: true,
      count: posts.length,
      data: posts.map((post) => ({
        ...post,
        isOwner: user?.id === post.userId,
      })),
    });
  } catch (error) {
    console.error("[GET /api/community error]:", error);
    return NextResponse.json(
      { success: false, message: "Gagal mengambil data laporan komunitas" },
      { status: 500 },
    );
  }
}

// ─────────────────────────────────────────────────────────────
// POST /api/community
// Membuat laporan postingan baru (Wajib Login)
// Body:
//   - title (string, min 3 char)
//   - description (string, min 5 char)
//   - locationName (string, min 2 char)
//   - damageLevel ("RINGAN" | "SEDANG" | "BERAT" | "DARURAT")
//   - imageUrl (string URL/base64, opsional)
//   - latitude (number, opsional)
//   - longitude (number, opsional)
// ─────────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Anda harus login terlebih dahulu untuk membuat laporan.",
        },
        { status: 401 },
      );
    }

    const body = await request.json();
    const {
      title,
      description,
      locationName,
      damageLevel = "RINGAN",
      imageUrl,
    } = body;

    // Validasi Field Wajib
    if (!title || typeof title !== "string" || title.trim().length < 3) {
      return NextResponse.json(
        {
          success: false,
          message: "Judul laporan wajib diisi (minimal 3 karakter).",
        },
        { status: 400 },
      );
    }

    if (
      !description ||
      typeof description !== "string" ||
      description.trim().length < 5
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Deskripsi kondisi kerusakan wajib diisi (minimal 5 karakter).",
        },
        { status: 400 },
      );
    }

    if (
      !locationName ||
      typeof locationName !== "string" ||
      locationName.trim().length < 2
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Nama lokasi wajib diisi (minimal 2 karakter).",
        },
        { status: 400 },
      );
    }

    const selectedCity = await findKotaPilihan(locationName.trim());
    if (!selectedCity) {
      return NextResponse.json(
        {
          success: false,
          message: "Pilih kota dari daftar lokasi yang tersedia.",
        },
        { status: 400 },
      );
    }

    const normalizedDamageLevel = damageLevel.toString().toUpperCase();
    if (!VALID_DAMAGE_LEVELS.includes(normalizedDamageLevel as DamageLevel)) {
      return NextResponse.json(
        {
          success: false,
          message: `Tingkat kerusakan tidak valid. Pilihan: ${VALID_DAMAGE_LEVELS.join(", ")}`,
        },
        { status: 400 },
      );
    }

    const newPost = await prisma.communityPost.create({
      data: {
        userId: user.id,
        title: title.trim(),
        description: description.trim(),
        locationName: selectedCity.name,
        damageLevel: normalizedDamageLevel,
        imageUrl:
          typeof imageUrl === "string" && imageUrl.trim()
            ? imageUrl.trim()
            : null,
        latitude: selectedCity.latitude,
        longitude: selectedCity.longitude,
      },
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

    return NextResponse.json(
      {
        success: true,
        message: "Laporan berhasil dipublikasikan.",
        data: newPost,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("[POST /api/community error]:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan saat menyimpan laporan." },
      { status: 500 },
    );
  }
}
