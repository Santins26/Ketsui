"use client";

import { useEffect, useRef, useState } from "react";

type MangaReaderProps = {
    pages: string[];
    storageKey: string;
};

type Position = { page: number; offset: number }; 

const KEY = "ketsui-reader-position";
const HEADER = 64; 

function readAll(): Record<string, Position> {
    try {
        return JSON.parse(localStorage.getItem(KEY) || "{}");
    } catch {
        return {};
    }
}

export default function MangaReader({ pages, storageKey }: MangaReaderProps) {
    const refs = useRef<(HTMLDivElement | null)[]>([]);
    const [target] = useState<Position>(() =>
        typeof window === "undefined"
            ? { page: 0, offset: 0 }
            : readAll()[storageKey] ?? { page: 0, offset: 0 }
    );
    const [loaded, setLoaded] = useState<boolean[]>(() => pages.map(() => false));
    const restoring = useRef(target.page > 0 || target.offset > 0);

    function scrollToTarget() {
        const el = refs.current[target.page];
        if (!el) return;
        const top = el.getBoundingClientRect().top + window.scrollY;
        window.scrollTo(0, top + target.offset * el.offsetHeight - HEADER);
    }

   
    useEffect(() => {
        if (!restoring.current) return;
        const stop = () => { restoring.current = false; };
        window.addEventListener("touchstart", stop, { once: true });
        window.addEventListener("wheel", stop, { once: true });
        const timeout = setTimeout(stop, 10000);
        scrollToTarget();
        return () => {
            clearTimeout(timeout);
            window.removeEventListener("touchstart", stop);
            window.removeEventListener("wheel", stop);
        };
    
    }, []);

    function handleLoad(index: number) {
        setLoaded((prev) => {
            const next = [...prev];
            next[index] = true;
            if (restoring.current && next.slice(0, target.page + 1).every(Boolean)) {
                requestAnimationFrame(() => {
                    scrollToTarget();
                    restoring.current = false;
                });
            }
            return next;
        });
        if (restoring.current && index <= target.page) {
            requestAnimationFrame(scrollToTarget);
        }
    }


    useEffect(() => {
        let t: number | undefined;

        const save = () => {
            if (restoring.current) return;
            const line = HEADER + 1;
            const index = refs.current.findIndex((el) => {
                if (!el) return false;
                const r = el.getBoundingClientRect();
                return r.top <= line && r.bottom > line;
            });
            if (index === -1) return;
            const r = refs.current[index]!.getBoundingClientRect();
            const all = readAll();
            all[storageKey] = { page: index, offset: (line - r.top) / r.height };
            localStorage.setItem(KEY, JSON.stringify(all));
        };

        const onScroll = () => {
            clearTimeout(t);
            t = window.setTimeout(save, 150);
        };
        const onHide = () => {
            if (document.visibilityState === "hidden") save();
        };

        window.addEventListener("scroll", onScroll, { passive: true });
        document.addEventListener("visibilitychange", onHide);
        window.addEventListener("pagehide", save);
        return () => {
            clearTimeout(t);
            window.removeEventListener("scroll", onScroll);
            document.removeEventListener("visibilitychange", onHide);
            window.removeEventListener("pagehide", save);
        };
    }, [storageKey]);

    return (
        <div className="min-h-screen bg-black">
            <div className="mx-auto flex w-full max-w-5xl flex-col items-center">
                {pages.map((page, index) => (
                    <div
                        key={page}
                        ref={(el) => { refs.current[index] = el; }}
                        className="w-full"
                    >
                        <img
                            src={page}
                            alt={`Page ${index + 1}`}
                            loading={index <= target.page ? "eager" : "lazy"}
                            onLoad={() => handleLoad(index)}
                            className="block h-auto w-full"
                            style={{ aspectRatio: loaded[index] ? undefined : "2 / 3" }}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}