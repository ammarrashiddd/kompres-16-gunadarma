import crypto from "node:crypto";
import { hashPassword, signToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export type OAuthProvider = "google" | "github";

export function getOAuthRedirectUri(
  provider: OAuthProvider,
  requestUrl: string,
): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? new URL(requestUrl).origin;
  return `${baseUrl}/api/auth/${provider}/callback`;
}

export function createOAuthState(): string {
  return crypto.randomBytes(24).toString("hex");
}

export async function createTokenForOAuthUser(
  email: string,
  name: string,
  provider: OAuthProvider,
): Promise<string> {
  const normalizedEmail = email.toLowerCase();
  const existingUser = await prisma.user.findUnique({
    where: { email: normalizedEmail },
    select: { id: true, nama: true, email: true },
  });

  const user = existingUser
    ? existingUser
    : await prisma.user.create({
        data: {
          nama: name.trim() || normalizedEmail.split("@")[0],
          email: normalizedEmail,
          password: await hashPassword(`${provider}:${crypto.randomUUID()}`),
        },
        select: { id: true, nama: true, email: true },
      });

  return signToken({
    id: user.id,
    nama: user.nama,
    email: user.email,
  });
}

export function oauthErrorUrl(
  provider: OAuthProvider,
  message: string,
  requestUrl: string,
): URL {
  const url = new URL("/login", requestUrl);
  url.searchParams.set("oauth_error", `${provider}: ${message}`);
  return url;
}
