import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google" && user.email) {
        // Simpan atau update user di database kita via API
        try {
          await fetch(`${process.env.NEXTAUTH_URL}/api/auth/oauth`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: user.email,
              nama: user.name ?? user.email.split("@")[0],
              provider: "google",
              providerId: account.providerAccountId,
              image: user.image,
            }),
          });
        } catch {
          // Lanjutkan meski gagal simpan — tidak blokir login
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
