import { NextResponse, type NextRequest } from "next/server";

const LOCALES = ["ar", "en"];

// Arabic is the default locale; any path without a locale prefix is redirected.
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (LOCALES.some((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`))) {
    return NextResponse.next();
  }
  const url = request.nextUrl.clone();
  url.pathname = `/ar${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url, 308);
}

export const config = {
  matcher: ["/((?!api|_next|media|brand|favicon.ico|robots.txt|sitemap.xml).*)"],
};
