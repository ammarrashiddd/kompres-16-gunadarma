import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { auth } from "@/auth";

export async function getAuthenticatedUser(request: NextRequest) {
  // 1. Cek sesi NextAuth (Google OAuth)
  try {
    const session = await auth();
    if (session?.user?.email) {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email.toLowerCase() },
      });
      if (user) return user;
    }
  } catch {}

  // 2. Cek custom JWT (Cookie atau Bearer token)
  const token =
    request.cookies.get("auth_token")?.value ??
    request.headers.get("authorization")?.replace("Bearer ", "");

  if (token) {
    try {
      const payload = verifyToken(token);
      const user = await prisma.user.findUnique({
        where: { id: payload.id },
      });
      if (user) return user;
    } catch {}
  }

  return null;
}
