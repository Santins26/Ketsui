"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";

const KEY = "ketsui-last-page";

export default function RememberLastPage() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const restored = useRef(false);


  useEffect(() => {
    if (restored.current) return;
    restored.current = true;

    try {
      const saved = localStorage.getItem(KEY);
      if (saved && window.location.pathname === "/" && saved !== "/") {
        router.replace(saved);
      }
    } catch {}
  }, [router]);

  const current =
    pathname + (searchParams.toString() ? `?${searchParams}` : "");

  useEffect(() => {
    if (!restored.current) return;
    try {
      localStorage.setItem(KEY, current);
    } catch {}
  }, [current]);

  useEffect(() => {
    const save = () => {
      try {
        localStorage.setItem(
          KEY,
          window.location.pathname + window.location.search
        );
      } catch {}
    };
    const onVis = () => document.visibilityState === "hidden" && save();
    window.addEventListener("pagehide", save);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      window.removeEventListener("pagehide", save);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return null;
}