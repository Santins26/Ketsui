"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function RememberLastPage() {
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        const lastPage = localStorage.getItem("lastPage");
        const alreadyStarted = sessionStorage.getItem("appStarted");

        if (!alreadyStarted) {
            sessionStorage.setItem("appStarted", "true");

            if (lastPage && lastPage !== pathname) {
                router.replace(lastPage);
            }
        }
    }, [pathname, router]);

    useEffect(() => {
        localStorage.setItem("lastPage", pathname);
    }, [pathname]);

    return null;
}