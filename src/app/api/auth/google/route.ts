import { NextRequest, NextResponse } from "next/server";
import {
  createOAuthState,
  getOAuthRedirectUri,
  oauthErrorUrl,
} from "@/lib/oauth";

export async function GET(request: NextRequest) {
  const clientId = process.env.GOOGLE_CLIENT_ID;

  if (!clientId) {
    return NextResponse.redirect(
      oauthErrorUrl("google", "belum dikonfigurasi", request.url),
    );
  }

  const state = createOAuthState();
  const redirectUri = getOAuthRedirectUri("google", request.url);
  const authorizationUrl = new URL(
    "https://accounts.google.com/o/oauth2/v2/auth",
  );
  authorizationUrl.searchParams.set("client_id", clientId);
  authorizationUrl.searchParams.set("redirect_uri", redirectUri);
  authorizationUrl.searchParams.set("response_type", "code");
  authorizationUrl.searchParams.set("scope", "openid email profile");
  authorizationUrl.searchParams.set("state", state);
  authorizationUrl.searchParams.set("access_type", "online");

  const response = NextResponse.redirect(authorizationUrl);
  response.cookies.set("oauth_state_google", state, {
    httpOnly: true,
    maxAge: 600,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });
  return response;
}
