import { NextRequest, NextResponse } from "next/server";
import {
  createTokenForOAuthUser,
  getOAuthRedirectUri,
  oauthErrorUrl,
} from "@/lib/oauth";

interface GoogleProfile {
  email?: string;
  name?: string;
}

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  const savedState = request.cookies.get("oauth_state_google")?.value;

  if (!code || !state || state !== savedState) {
    return NextResponse.redirect(
      oauthErrorUrl("google", "sesi tidak valid", request.url),
    );
  }

  try {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    if (!clientId || !clientSecret)
      throw new Error("Google OAuth belum dikonfigurasi");

    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: getOAuthRedirectUri("google", request.url),
        grant_type: "authorization_code",
      }),
    });

    if (!tokenResponse.ok) throw new Error("token Google tidak valid");
    const tokenData = (await tokenResponse.json()) as { access_token?: string };
    if (!tokenData.access_token)
      throw new Error("token Google tidak ditemukan");

    const profileResponse = await fetch(
      "https://openidconnect.googleapis.com/v1/userinfo",
      { headers: { Authorization: `Bearer ${tokenData.access_token}` } },
    );
    if (!profileResponse.ok)
      throw new Error("profil Google tidak dapat dibaca");

    const profile = (await profileResponse.json()) as GoogleProfile;
    if (!profile.email) throw new Error("email Google tidak tersedia");

    const token = await createTokenForOAuthUser(
      profile.email,
      profile.name ?? "Pengguna SIGAP",
      "google",
    );
    const callbackUrl = new URL("/auth/oauth-callback", request.url);
    callbackUrl.searchParams.set("token", token);
    return NextResponse.redirect(callbackUrl);
  } catch (error) {
    console.error("[GET /api/auth/google/callback]", error);
    return NextResponse.redirect(
      oauthErrorUrl("google", "login gagal", request.url),
    );
  }
}
