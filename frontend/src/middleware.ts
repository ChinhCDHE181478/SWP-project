import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";

// Các route không yêu cầu đăng nhập
const guestPath = [
  "/auth/login",
  "/auth/register",
  "/about-us",
  "/access-denied",
  "/forgot",
  "/news",
  "/",
  "/not-found",
  "/api/auth/refresh",
  "/api/auth/token",
  "api/chat",
  "/test"
];

// Các route chỉ dành cho khách (người chưa đăng nhập)
const onlyGuestPath = ["/auth/login", "/auth/register", "/forgot"];

// Phân quyền theo role
const rolePaths: Record<string, string[]> = {
  USER: [
    "/profile",
    "/update-profile",
    "/about-us",
    "/access-denied",
    "/news",
    "/",
    "/not-found",
    "/api/auth/logout",
    "/api/auth/refresh",
    "/api/auth/token",
    "api/chat",
    "/practice",
    "/mockexam"
  ],
  ADMIN: [
    "/controller/admin",
    "/access-denied",
    "/not-found",
    "/api/auth/logout",
    "/api/auth/refresh",
    "/api/auth/token",
    "/",
  ],
  QUIZ_MANAGER: [
    "/controller/quiz-manager",
    "/access-denied",
    "/not-found",
    "/api/auth/logout",
    "/api/auth/refresh",
    "/api/auth/token",
  ],
  SUPPORT_MANAGER: [
    "/controller/support-manager",
    "/access-denied",
    "/not-found",
    "/api/auth/logout",
    "/api/auth/refresh",
    "/api/auth/token",
  ],
  CONTENT_MANAGER: [
    "/controller/content-manager",
    "/access-denied",
    "/not-found",
    "/api/auth/logout",
    "/api/auth/refresh",
    "/api/auth/token",
  ],
};

const allPath = [
  ...new Set([
    ...guestPath,
    ...onlyGuestPath,
    ...Object.values(rolePaths).flat(),
  ]),
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/_next/")) {
    return NextResponse.next();
  }

  if (
    pathname.match(
      /\.(png|jpg|jpeg|gif|svg|webp|ico|mp4|mp3|woff2?|ttf|otf|eot)$/
    )
  ) {
    return NextResponse.next();
  }

  if (pathname.match(/^\/(login|home)\/.+/)) {
    return NextResponse.next();
  }

  if (!allPath.includes(pathname)) {
    return NextResponse.redirect(new URL("/not-found", request.url));
  }

  const cookieStore = cookies();
  const refreshToken = (await cookieStore).get("refresh_token")?.value;
  const accessToken = (await cookieStore).get("access_token")?.value;
  console.log(pathname);

  if (!refreshToken) {
    if (!guestPath.includes(pathname)) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
    return NextResponse.next();
  }

  if (refreshToken && onlyGuestPath.includes(pathname)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (accessToken) {
    try {
      const decoded = jwtDecode<{ scope?: string }>(accessToken);
      const scope = decoded?.scope;

      console.log("scope:", scope);

      if (
        !scope ||
        !rolePaths[scope]?.includes(pathname) // Use 'includes' for exact match
      ) {
        return NextResponse.redirect(new URL("/access-denied", request.url));
      }

      return NextResponse.next();
    } catch (error) {
      console.error("error decode:", error);
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
  }

  return NextResponse.next();
}
