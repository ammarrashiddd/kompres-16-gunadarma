import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, verifyPassword } from "@/lib/auth";
import { getAuthenticatedUser } from "@/lib/server-auth";

export async function GET(request: NextRequest) {
  const user = await getAuthenticatedUser(request);
  if (!user) {
    return NextResponse.json(
      { success: false, message: "Tidak terautentikasi" },
      { status: 401 }
    );
  }

  const isOAuthUser = user.password.startsWith("google:") || user.password.startsWith("github:");

  return NextResponse.json({
    success: true,
    data: {
      id: user.id,
      nama: user.nama,
      email: user.email,
      avatar: user.avatar,
      isOAuth: isOAuthUser,
    },
  });
}

export async function PUT(request: NextRequest) {
  const user = await getAuthenticatedUser(request);
  if (!user) {
    return NextResponse.json(
      { success: false, message: "Tidak terautentikasi" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { nama, avatar, currentPassword, newPassword } = body;

    const updateData: { nama?: string; avatar?: string; password?: string } = {};

    // Validasi Nama
    if (typeof nama === "string") {
      const trimmed = nama.trim();
      if (trimmed.length < 2) {
        return NextResponse.json(
          { success: false, message: "Nama minimal 2 karakter" },
          { status: 400 }
        );
      }
      updateData.nama = trimmed;
    }

    // Update Avatar (bisa URL atau base64)
    if (typeof avatar === "string") {
      updateData.avatar = avatar;
    }

    // Ganti Password jika ada input newPassword
    if (newPassword) {
      if (newPassword.length < 8) {
        return NextResponse.json(
          { success: false, message: "Password baru minimal 8 karakter" },
          { status: 400 }
        );
      }

      const isOAuthUser = user.password.startsWith("google:") || user.password.startsWith("github:");

      // Jika bukan akun OAuth, verifikasi password saat ini
      if (!isOAuthUser) {
        if (!currentPassword) {
          return NextResponse.json(
            { success: false, message: "Password saat ini wajib diisi" },
            { status: 400 }
          );
        }

        const isValid = await verifyPassword(currentPassword, user.password);
        if (!isValid) {
          return NextResponse.json(
            { success: false, message: "Password saat ini tidak sesuai" },
            { status: 400 }
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
      },
    });
  } catch (error) {
    console.error("[PUT /api/user/profile error]:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan pada server" },
      { status: 500 }
    );
  }
}
