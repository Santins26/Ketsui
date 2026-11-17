// src/proxy.ts
import { NextResponse, type NextRequest } from "next/server";

export function proxy(req: NextRequest) {
  if (req.nextUrl.searchParams.get("source") !== "pwa") return;

  const raw = req.cookies.get("ketsui-last-page")?.value;
  if (!raw) return;

  const last = decodeURIComponent(raw);
  if (last.startsWith("/") && !last.startsWith("//") && last !== "/") {
    return NextResponse.redirect(new URL(last, req.url));
  }
}

export const config = { matcher: "/" };