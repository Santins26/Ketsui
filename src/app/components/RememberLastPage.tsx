
"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function RememberLastPage() {
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("ketsui-last-page");
    const current = window.location.pathname;

    if (saved) {
      const destination = new URL(saved, window.location.origin);

      if (
        destination.origin === window.location.origin &&
        destination.pathname !== current
      ) {
        window.location.replace(
          destination.pathname + destination.search + destination.hash
        );
        return;
      }
    }

    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready || !pathname) return;

    localStorage.setItem("ketsui-last-page", pathname);
  }, [pathname, ready]);

  return null;
}
