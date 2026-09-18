import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
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

    // ── Cek Email Sudah Terdaftar ─────────────────────────
    const existingUsers = await query<{ id: number }>(
      "SELECT id FROM users WHERE email = $1 LIMIT 1",
      [email.toLowerCase()]
    );

    if (existingUsers.length > 0) {
      return NextResponse.json(
        { success: false, message: "Email sudah terdaftar. Silakan gunakan email lain." },
        { status: 409 }
      );
    }

    // ── Hash Password & Simpan User ───────────────────────
    const hashedPassword = await hashPassword(password);

    const newUsers = await query<{
      id: number;
      nama: string;
      email: string;
      created_at: string;
    }>(
      `INSERT INTO users (nama, email, password)
       VALUES ($1, $2, $3)
       RETURNING id, nama, email, created_at`,
      [nama.trim(), email.toLowerCase(), hashedPassword]
    );

    const user = newUsers[0];

    return NextResponse.json(
      {
        success: true,
        message: "Registrasi berhasil! Silakan login.",
        data: {
          id: user.id,
          nama: user.nama,
          email: user.email,
          created_at: user.created_at,
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
