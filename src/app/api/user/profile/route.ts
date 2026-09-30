import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, verifyPassword } from "@/lib/auth";
import { getAuthenticatedUser } from "@/lib/server-auth";
import { findKotaPilihan } from "@/lib/namaDaerah/kotaPilihan";

export async function GET(request: NextRequest) {
  const user = await getAuthenticatedUser(request);
  if (!user) {
    return NextResponse.json(
      { success: false, message: "Tidak terautentikasi" },
      { status: 401 },
    );
  }

  const isOAuthUser =
    user.password.startsWith("google:") || user.password.startsWith("github:");

  return NextResponse.json({
    success: true,
    data: {
      id: user.id,
      nama: user.nama,
      email: user.email,
      avatar: user.avatar,
      cityName: user.cityName,
      cityLatitude: user.cityLatitude,
      cityLongitude: user.cityLongitude,
      isOAuth: isOAuthUser,
    },
  });
}

export async function PUT(request: NextRequest) {
  const user = await getAuthenticatedUser(request);
  if (!user) {
    return NextResponse.json(
      { success: false, message: "Tidak terautentikasi" },
      { status: 401 },
    );
  }

  try {
    const body = await request.json();
    const { nama, avatar, cityName, currentPassword, newPassword } = body;

    const updateData: {
      nama?: string;
      avatar?: string;
      password?: string;
      cityName?: string | null;
      cityLatitude?: number | null;
      cityLongitude?: number | null;
    } = {};

    // Validasi Nama
    if (typeof nama === "string") {
      const trimmed = nama.trim();
      if (trimmed.length < 2) {
        return NextResponse.json(
          { success: false, message: "Nama minimal 2 karakter" },
          { status: 400 },
        );
      }
      updateData.nama = trimmed;
    }

    // Update Avatar (bisa URL atau base64)
    if (typeof avatar === "string") {
      updateData.avatar = avatar;
    }

    if (cityName !== undefined) {
      if (cityName === null || cityName === "") {
        updateData.cityName = null;
        updateData.cityLatitude = null;
        updateData.cityLongitude = null;
      } else {
        const kota = await findKotaPilihan(cityName);
        if (!kota) {
          return NextResponse.json(
            { success: false, message: "Kota tidak tersedia dalam pilihan." },
            { status: 400 },
          );
        }
        updateData.cityName = kota.name;
        updateData.cityLatitude = kota.latitude;
        updateData.cityLongitude = kota.longitude;
      }
    }

    // Ganti Password jika ada input newPassword
    if (newPassword) {
      if (newPassword.length < 8) {
        return NextResponse.json(
          { success: false, message: "Password baru minimal 8 karakter" },
          { status: 400 },
        );
      }

      const isOAuthUser =
        user.password.startsWith("google:") ||
        user.password.startsWith("github:");

      // Jika bukan akun OAuth, verifikasi password saat ini
      if (!isOAuthUser) {
        if (!currentPassword) {
          return NextResponse.json(
            { success: false, message: "Password saat ini wajib diisi" },
            { status: 400 },
          );
        }

        const isValid = await verifyPassword(currentPassword, user.password);
        if (!isValid) {
          return NextResponse.json(
            { success: false, message: "Password saat ini tidak sesuai" },
            { status: 400 },
          );
        }
      }

      updateData.password = await hashPassword(newPassword);
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      message: "Profil berhasil diperbarui",
      data: {
        id: updatedUser.id,
        nama: updatedUser.nama,
        email: updatedUser.email,
        avatar: updatedUser.avatar,
        cityName: updatedUser.cityName,
        cityLatitude: updatedUser.cityLatitude,
        cityLongitude: updatedUser.cityLongitude,
      },
    });
  } catch (error) {
    console.error("[PUT /api/user/profile error]:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan pada server" },
      { status: 500 },
    );
  }
}
