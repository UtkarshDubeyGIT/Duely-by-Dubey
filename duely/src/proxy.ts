import { NextResponse, type NextRequest } from "next/server";

const publicRoutes = ["/", "/login", "/signup"];

/**
 * Decode a base64url string (used in JWT parsing).
 * Works in Edge runtime without Node.js crypto/Buffer.
 */
function base64UrlDecode(str: string): string {
  // Pad to multiple of 4
  const padded = str.replace(/-/g, "+").replace(/_/g, "/");
  const pad = padded.length % 4;
  const b64 = pad ? padded + "=".repeat(4 - pad) : padded;
  try {
    return atob(b64);
  } catch {
    return "";
  }
}

/**
 * Check if a Supabase session cookie represents a valid (non-expired) session.
 * We only look at the JWT expiry — no signature verification needed here
 * since the actual API calls will enforce auth server-side.
 */
function getSessionFromCookies(request: NextRequest): boolean {
  // Supabase stores the session in cookies named like:
  //   sb-<project-ref>-auth-token.0, sb-<project-ref>-auth-token.1
  // or the combined: sb-<project-ref>-auth-token
  const cookies = request.cookies.getAll();

  for (const cookie of cookies) {
    if (!cookie.name.includes("-auth-token")) continue;

    // Skip chunk cookies (we'll read the base token)
    if (cookie.name.endsWith(".1")) continue;

    try {
      let value = cookie.value;

      // Some versions store it as JSON {"access_token":...}
      if (value.startsWith("%7B") || value.startsWith("{")) {
        const decoded = value.startsWith("%7B")
          ? decodeURIComponent(value)
          : value;
        const parsed = JSON.parse(decoded);
        value = parsed.access_token ?? "";
      }

      // Validate the JWT expiry
      const parts = value.split(".");
      if (parts.length !== 3) continue;

      const payload = JSON.parse(base64UrlDecode(parts[1]));
      if (payload?.exp && payload.exp * 1000 > Date.now()) {
        return true;
      }
    } catch {
      // malformed cookie — skip
    }
  }

  return false;
}

export async function proxy(request: NextRequest) {
  const isPublic = publicRoutes.some((route) =>
    route === "/"
      ? request.nextUrl.pathname === "/"
      : request.nextUrl.pathname.startsWith(route),
  );

  const hasSession = getSessionFromCookies(request);

  // Redirect unauthenticated users away from protected routes
  if (
    !hasSession &&
    !isPublic &&
    !request.nextUrl.pathname.startsWith("/api")
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Redirect authenticated users away from auth pages
  if (hasSession && isPublic) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
