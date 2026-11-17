// proxy.ts (in the project root, or in src/ if you use src/)
import { NextResponse, type NextRequest } from "next/server";

export function proxy(req: NextRequest) {
  const raw = req.cookies.get("ketsui-last-page")?.value;
  if (!raw) return;

  const last = decodeURIComponent(raw);
  if (last.startsWith("/") && !last.startsWith("//") && last !== "/") {
    return NextResponse.redirect(new URL(last, req.url));
  }
}

export const config = { matcher: "/" };