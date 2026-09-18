import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, isValidEmail, isValidPassword } from "@/lib/auth";

interface RegisterBody {
  nama?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: RegisterBody = await request.json();
    const { nama, email, password, confirmPassword } = body;

    // ── Validasi Input ────────────────────────────────────
    if (!nama || !email || !password || !confirmPassword) {
      return NextResponse.json(
        { success: false, message: "Semua field wajib diisi." },
        { status: 400 }
      );
    }

    if (nama.trim().length < 2) {
      return NextResponse.json(
        { success: false, message: "Nama minimal 2 karakter." },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { success: false, message: "Format email tidak valid." },
        { status: 400 }
      );
    }

    if (!isValidPassword(password)) {
      return NextResponse.json(
        { success: false, message: "Password minimal 8 karakter." },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { success: false, message: "Konfirmasi password tidak cocok." },
        { status: 400 }
      );
    }

    // ── Cek Email Sudah Terdaftar (Prisma) ─────────────────
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      select: { id: true },
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "Email sudah terdaftar. Silakan gunakan email lain." },
        { status: 409 }
      );
    }

    // ── Hash Password & Simpan User (Prisma) ───────────────
    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        nama: nama.trim(),
        email: email.toLowerCase(),
        password: hashedPassword,
      },
      select: {
        id: true,
        nama: true,
        email: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Registrasi berhasil! Silakan login.",
        data: {
          id: user.id,
          nama: user.nama,
          email: user.email,
          created_at: user.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/auth/register]", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan pada server. Coba lagi nanti." },
      { status: 500 }
    );
  }
}
