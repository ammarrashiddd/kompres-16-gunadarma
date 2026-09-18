import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
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

    // ── Cari User di Database ─────────────────────────────
    const users = await query<{
      id: number;
      nama: string;
      email: string;
      password: string;
      created_at: string;
    }>(
      "SELECT id, nama, email, password, created_at FROM users WHERE email = $1 LIMIT 1",
      [email.toLowerCase()]
    );

    if (users.length === 0) {
      // Pesan generik agar tidak mengekspos informasi user mana yang ada
      return NextResponse.json(
        { success: false, message: "Email atau password salah." },
        { status: 401 }
      );
    }

    const user = users[0];

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
          created_at: user.created_at,
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
