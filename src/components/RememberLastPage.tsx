
"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function RememberLastPage() {
  const pathname = usePathname();
  const router = useRouter();

  const status = useRef<"pending" | "redirecting" | "ready">("pending");
  const target = useRef<string | null>(null);

  useEffect(() => {
    if (status.current === "pending") {
      const lastPage = localStorage.getItem("lastPage");

      if (
        lastPage &&
        lastPage.startsWith("/") &&
        !lastPage.startsWith("//") &&
        lastPage !== pathname
      ) {
        target.current = lastPage;
        status.current = "redirecting";
        router.replace(lastPage);
        return;
      }

      status.current = "ready";
    }

    if (status.current === "redirecting") {
      if (pathname !== target.current) return;

      status.current = "ready";
    }

    if (status.current === "ready") {
      localStorage.setItem("lastPage", pathname);
    }
  }, [pathname, router]);

  return null;
}
