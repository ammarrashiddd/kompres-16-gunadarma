import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ──────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────

export interface JwtPayload {
  id: number;
  nama: string;
  email: string;
  iat?: number;
  exp?: number;
}

// ──────────────────────────────────────────────
// Password Hashing
// ──────────────────────────────────────────────

const SALT_ROUNDS = 12;

/**
 * Menghasilkan hash bcrypt dari password plain-text.
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Memverifikasi apakah password plain-text cocok dengan hash yang tersimpan.
 */
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// ──────────────────────────────────────────────
// JSON Web Token
// ──────────────────────────────────────────────

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error(
      "JWT_SECRET belum dikonfigurasi. Pastikan file .env.local sudah dibuat."
    );
  }
  return secret;
}

/**
 * Membuat JWT token dengan payload data user.
 * Default expiry: 7 hari (dapat dikonfigurasi via JWT_EXPIRES_IN).
 */
export function signToken(payload: Omit<JwtPayload, "iat" | "exp">): string {
  const secret = getJwtSecret();
  const expiresIn = (process.env.JWT_EXPIRES_IN ?? "7d") as jwt.SignOptions["expiresIn"];

  return jwt.sign(payload, secret, { expiresIn });
}

/**
 * Memverifikasi dan mendekode JWT token.
 * Melempar error jika token tidak valid atau sudah expired.
 */
export function verifyToken(token: string): JwtPayload {
  const secret = getJwtSecret();
  return jwt.verify(token, secret) as JwtPayload;
}

// ──────────────────────────────────────────────
// Input Validation Helpers
// ──────────────────────────────────────────────

/**
 * Validasi format email menggunakan regex sederhana.
 */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Validasi kekuatan password: minimal 8 karakter.
 */
export function isValidPassword(password: string): boolean {
  return password.length >= 8;
}
