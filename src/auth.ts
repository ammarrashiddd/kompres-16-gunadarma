import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import crypto from "node:crypto";

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret:
    process.env.AUTH_SECRET ??
    process.env.NEXTAUTH_SECRET ??
    process.env.JWT_SECRET,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google" && user.email) {
        try {
          const normalizedEmail = user.email.toLowerCase();
          const existingUser = await prisma.user.findUnique({
            where: { email: normalizedEmail },
          });

          if (!existingUser) {
            await prisma.user.create({
              data: {
                nama: user.name?.trim() || normalizedEmail.split("@")[0],
                email: normalizedEmail,
                password: await hashPassword(`google:${crypto.randomUUID()}`),
              },
            });
          }
        } catch (error) {
          console.error("[NextAuth signIn callback error]:", error);
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (account && user) {
        token.provider = account.provider;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.provider) {
        // @ts-expect-error custom field
        session.provider = token.provider;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Setelah Google login → dashboard
      if (url.startsWith(baseUrl)) return url;
      return `${baseUrl}/dashboard`;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
  },
});
