import { NextRequest, NextResponse } from "next/server";
import {
  createTokenForOAuthUser,
  getOAuthRedirectUri,
  oauthErrorUrl,
} from "@/lib/oauth";

interface GitHubProfile {
  email?: string | null;
  name?: string | null;
  login?: string;
}

interface GitHubEmail {
  email: string;
  primary: boolean;
  verified: boolean;
}

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  const savedState = request.cookies.get("oauth_state_github")?.value;

  if (!code || !state || state !== savedState) {
    return NextResponse.redirect(
      oauthErrorUrl("github", "sesi tidak valid", request.url),
    );
  }

  try {
    const clientId = process.env.GITHUB_CLIENT_ID;
    const clientSecret = process.env.GITHUB_CLIENT_SECRET;
    if (!clientId || !clientSecret)
      throw new Error("GitHub OAuth belum dikonfigurasi");

    const tokenResponse = await fetch(
      "https://github.com/login/oauth/access_token",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client_id: clientId,
          client_secret: clientSecret,
          code,
          redirect_uri: getOAuthRedirectUri("github", request.url),
        }),
      },
    );

    if (!tokenResponse.ok) throw new Error("token GitHub tidak valid");
    const tokenData = (await tokenResponse.json()) as { access_token?: string };
    if (!tokenData.access_token)
      throw new Error("token GitHub tidak ditemukan");

    const headers = {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${tokenData.access_token}`,
      "X-GitHub-Api-Version": "2022-11-28",
    };
    const profileResponse = await fetch("https://api.github.com/user", {
      headers,
    });
    if (!profileResponse.ok)
      throw new Error("profil GitHub tidak dapat dibaca");
    const profile = (await profileResponse.json()) as GitHubProfile;

    let email = profile.email ?? null;
    if (!email) {
      const emailsResponse = await fetch("https://api.github.com/user/emails", {
        headers,
      });
      const emails = (await emailsResponse.json()) as GitHubEmail[];
      email =
        emails.find((item) => item.primary && item.verified)?.email ?? null;
    }
    if (!email) throw new Error("email GitHub tidak tersedia");

    const token = await createTokenForOAuthUser(
      email,
      profile.name ?? profile.login ?? "Pengguna SIGAP",
      "github",
    );
    const callbackUrl = new URL("/auth/oauth-callback", request.url);
    callbackUrl.searchParams.set("token", token);
    return NextResponse.redirect(callbackUrl);
  } catch (error) {
    console.error("[GET /api/auth/github/callback]", error);
    return NextResponse.redirect(
      oauthErrorUrl("github", "login gagal", request.url),
    );
  }
}
