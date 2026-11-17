
"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function RememberLastPage() {
  const pathname = usePathname();
  const router = useRouter();

  const [ready, setReady] = useState(false);
  const target = useRef<string | null>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const saved = localStorage.getItem("lastPage");

    if (
      saved &&
      saved.startsWith("/") &&
      !saved.startsWith("//") &&
      saved !== window.location.pathname
    ) {
      target.current = saved;
      router.replace(saved);
    } else {
      setReady(true);
    }
  }, [router]);


  useEffect(() => {
    if (ready) return;

    if (target.current === pathname) {
      target.current = null;
      setReady(true);
    }
  }, [pathname, ready]);

  useEffect(() => {
    if (!ready) return;

    localStorage.setItem("lastPage", pathname);
  }, [pathname, ready]);

  return null;
}
