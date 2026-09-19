import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, signToken, isValidEmail } from "@/lib/auth";

interface LoginBody {
  email?: string;
  password?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: LoginBody = await request.json();
    const { email, password } = body;

    // ── Validasi Input ────────────────────────────────────
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email dan password wajib diisi." },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { success: false, message: "Format email tidak valid." },
        { status: 400 }
      );
    }

    // ── Cari User di Database (Prisma) ────────────────────
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Email atau password salah." },
        { status: 401 }
      );
    }

    // ── Verifikasi Password ───────────────────────────────
    const isPasswordValid = await verifyPassword(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: "Email atau password salah." },
        { status: 401 }
      );
    }

    // ── Generate JWT Token ────────────────────────────────
    const token = signToken({
      id: user.id,
      nama: user.nama,
      email: user.email,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Login berhasil!",
        token,
        data: {
          id: user.id,
          nama: user.nama,
          email: user.email,
          created_at: user.createdAt,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[POST /api/auth/login]", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan pada server. Coba lagi nanti." },
      { status: 500 }
    );
  }
}
