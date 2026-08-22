import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { parseJwt } from "./app/utils/utils";

// List of paths that should bypass authentication check
const publicPaths = ["/login", "/register", "/api/refresh", "/calendar"];

export async function middleware(request: NextRequest) {
  if (publicPaths.some((path) => request.nextUrl.pathname.startsWith(path))) {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get("session")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  let response = NextResponse.next();

  const loginUrl = new URL("/login", request.url);

  if (!accessToken || !refreshToken) {
    return NextResponse.redirect(loginUrl);
  }

  try {
    const decoded: any = parseJwt(accessToken);
    const now = Math.floor(Date.now() / 1000);

    if (decoded.exp < now + 30) {
      const refreshRes = await fetch(
        `${process.env.API_URL}/Token/refresh-token`,
        {
          method: "POST",
          headers: {
            refreshToken: refreshToken,
          },
        },
      );

      if (!refreshRes.ok) throw new Error("refresh failed");

      const data = await refreshRes.json();
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set("Authorization", `Bearer ${data.accessToken}`);

      response = NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });

      response.cookies.set("session", data.accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
      });
      // setAccessToken(data.accessToken); // Set in-memory token for API client
      response.cookies.set("refreshToken", data.refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
      });
    }
  } catch {
    response.cookies.delete("session");
    response.cookies.delete("refreshToken");
  }

  return response;
}

// Configure which paths this middleware runs on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};
