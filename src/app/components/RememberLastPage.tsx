
"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function RememberLastPage() {
  const pathname = usePathname();
  const router = useRouter();

  const [restored, setRestored] = useState(false);
  const redirectTarget = useRef<string | null>(null);

  useEffect(() => {
    const lastPage = localStorage.getItem("lastPage");

    if (
      lastPage &&
      lastPage.startsWith("/") &&
      !lastPage.startsWith("//") &&
      lastPage !== window.location.pathname
    ) {
      redirectTarget.current = lastPage;
      router.replace(lastPage);
    } else {
      setRestored(true);
    }
  }, [router]);

  useEffect(() => {
    if (!restored) {
      if (
        redirectTarget.current &&
        pathname === redirectTarget.current
      ) {
        redirectTarget.current = null;
        setRestored(true);
      }

      return;
    }

    localStorage.setItem("lastPage", pathname);
  }, [pathname, restored]);

  return null;
}
