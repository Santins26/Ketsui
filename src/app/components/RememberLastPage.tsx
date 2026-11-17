// app/components/RememberLastPage.tsx
"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const KEY = "ketsui-last-page";

function save(path: string) {
  document.cookie = `${KEY}=${encodeURIComponent(path)}; path=/; max-age=31536000; samesite=lax`;
}

export default function RememberLastPage() {
  const pathname = usePathname();

  // Save on every route change (but never overwrite with "/")
  useEffect(() => {
    if (pathname && pathname !== "/") {
      save(pathname + window.location.search);
    }
  }, [pathname]);

  // Save again when iOS hides the app
  useEffect(() => {
    const onHide = () => {
      const p = window.location.pathname;
      if (p !== "/") save(p + window.location.search);
    };
    window.addEventListener("pagehide", onHide);
    document.addEventListener("visibilitychange", onHide);
    return () => {
      window.removeEventListener("pagehide", onHide);
      document.removeEventListener("visibilitychange", onHide);
    };
  }, []);

  return null;
}