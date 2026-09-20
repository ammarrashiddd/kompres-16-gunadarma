import { NextRequest, NextResponse } from "next/server";
import {
  createOAuthState,
  getOAuthRedirectUri,
  oauthErrorUrl,
} from "@/lib/oauth";

export async function GET(request: NextRequest) {
  const clientId = process.env.GITHUB_CLIENT_ID;

  if (!clientId) {
    return NextResponse.redirect(
      oauthErrorUrl("github", "belum dikonfigurasi", request.url),
    );
  }

  const state = createOAuthState();
  const authorizationUrl = new URL("https://github.com/login/oauth/authorize");
  authorizationUrl.searchParams.set("client_id", clientId);
  authorizationUrl.searchParams.set(
    "redirect_uri",
    getOAuthRedirectUri("github", request.url),
  );
  authorizationUrl.searchParams.set("scope", "read:user user:email");
  authorizationUrl.searchParams.set("state", state);

  const response = NextResponse.redirect(authorizationUrl);
  response.cookies.set("oauth_state_github", state, {
    httpOnly: true,
    maxAge: 600,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });
  return response;
}
