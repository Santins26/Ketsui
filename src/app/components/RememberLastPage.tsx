
"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function RememberLastPage() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const lastPage = localStorage.getItem("lastPage");
    const currentPage = window.location.pathname;

    if (
      lastPage &&
      lastPage.startsWith("/") &&
      !lastPage.startsWith("//") &&
      lastPage !== currentPage
    ) {
      router.replace(lastPage);
    }
  }, [router]);

  useEffect(() => {
    const lastPage = localStorage.getItem("lastPage");

    if (lastPage && lastPage !== pathname) return;

    localStorage.setItem("lastPage", pathname);
  }, [pathname]);

  return null;
}
