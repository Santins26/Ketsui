
"use client";

import { useParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { saveReadingProgress } from "@/lib/reading-progress";
import MangaReader from "@/components/manga/MangaReader";

type MangaChapter = {
    id: string;
    title: string;
    releaseDate: string;
};

function ChapterContent() {
    const { id, chapterId } = useParams<{
        id: string;
        chapterId: string;
    }>();

    const [pages, setPages] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [nextChapter, setNextChapter] = useState<MangaChapter | null>(null);
    const [previousChapter, setPreviousChapter] = useState<MangaChapter | null>(null);

    useEffect(() => {
        async function fetchPages() {
            try {
                setLoading(true);
                setError("");

                const response = await fetch(
                    `/api/chapter/${chapterId}`
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.error || "Failed to load chapter"
                    );
                }

                setPages(data.pages);
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : "Something went wrong"
                );
            } finally {
                setLoading(false);
            }
        }

        fetchPages();
    }, [chapterId]);
    useEffect(() => {
    async function fetchChapterNavigation() {
        try {
            let mangaId = id;

try {
    while (mangaId.includes("%")) {
        const decoded = decodeURIComponent(mangaId);

        if (decoded === mangaId) break;

        mangaId = decoded;
    }
} catch (error) {
    console.error("Error decoding manga ID:", error);
}

            const response = await fetch(
    `/api/manga/details?mangaId=${encodeURIComponent(mangaId)}`,
    {
        cache: "no-store",
    }
);

            if (!response.ok) {
                throw new Error("Failed to fetch manga chapters");
            }

            const manga = await response.json();
            console.log("Manga ID:", manga.id);
            console.log("Manga title:", manga.title);
            console.log("Chapters received:", manga.chapters?.length);
            localStorage.getItem("ketsui-reading-library")

const currentChapter = manga.chapters?.find(
    (chapter: MangaChapter) => chapter.id === chapterId
);

console.log("Current chapter found:", currentChapter);
            

            const mangaChapters: MangaChapter[] = manga.chapters ?? [];

            
            if (currentChapter) {
                saveReadingProgress(
                    {
                        id: manga.id,
                        title: manga.title,
                        image: manga.image,
                        authors: manga.authors ?? [],
                        genres: manga.genres ?? [],
                        status: manga.status ?? "Reading",
                    },
                    {
                        id: currentChapter.id,
                        title: currentChapter.title,
                    }
                )
            }


console.log("Navigation API response:", manga);
console.log("Response keys:", Object.keys(manga));
console.log("Chapters property:", manga.chapters);

const chapters: MangaChapter[] = manga.chapters ?? [];
console.log("Fresh navigation chapters:", chapters.length);

            const currentIndex = chapters.findIndex(
                (chapter) => chapter.id === chapterId
            );

            console.log("Current chapter ID:", chapterId);
            console.log("Total chapters:", chapters.length);
            console.log("Current chapter index:", currentIndex);
            console.log("Next chapter:", chapters[currentIndex - 1]);
            console.log("Previous chapter:", chapters[currentIndex + 1]);

            if (currentIndex === -1) {
                return;
            }

            setNextChapter(
                currentIndex > 0 ? chapters[currentIndex - 1] : null
            );

            setPreviousChapter(
                currentIndex < chapters.length - 1
                    ? chapters[currentIndex + 1]
                    : null
            );
        } catch (error) {
            console.error("Chapter navigation error:", error);
        }
    }

    if (id && chapterId) {
        fetchChapterNavigation();
    }
}, [id, chapterId]);

    return (
        <main className="min-h-screen bg-black text-white">

            <header className="sticky top-0 z-50 flex items-center justify-between border-b border-gray-800 bg-black/90 p-4 backdrop-blur">
                <Link
                    href={`/manga/${id}`}
                    className="text-gray-300 transition hover:text-white"
                >
                    ← Back to manga
                </Link>

                <span className="text-sm text-gray-400">
                    {pages.length > 0
                        ? `${pages.length} pages`
                        : "Manga Reader"}
                </span>
            </header>

            {loading && (
                <div className="flex min-h-[70vh] items-center justify-center">
                    <p className="text-gray-400">
                        Loading chapter...
                    </p>
                </div>
            )}

            {error && (
                <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4">
                    <p className="text-red-400">{error}</p>

                    <button
                        onClick={() => window.location.reload()}
                        className="rounded-lg bg-gray-800 px-4 py-2 hover:bg-gray-700"
                    >
                        Try again
                    </button>
                </div>
            )}

            {!loading && !error && pages.length > 0 && (
    <>
        <MangaReader pages={pages} />

        <nav className="mx-auto flex max-w-4xl items-center justify-between gap-4 border-t border-gray-800 p-6">
            {previousChapter ? (
                <Link
                    href={`/manga/${id}/chapter/${previousChapter.id}`}
                    className="rounded-lg bg-gray-800 px-5 py-3 text-sm transition hover:bg-gray-700"
                >
                    ← Previous chapter
                </Link>
            ) : (
                <span className="text-sm text-gray-600">
                    No previous chapter
                </span>
            )}

            {nextChapter ? (
                <Link
                    href={`/manga/${id}/chapter/${nextChapter.id}`}
                    className="rounded-lg bg-blue-600 px-5 py-3 text-sm transition hover:bg-blue-500"
                >
                    Next chapter →
                </Link>
            ) : (
                <span className="text-sm text-gray-600">
                    No next chapter
                </span>
            )}
        </nav>
    </>
)}

            {!loading && !error && pages.length === 0 && (
                <p className="py-20 text-center text-gray-400">
                    No pages found for this chapter.
                </p>
            )}

        </main>
    );
}

export default function ChapterPage() {
    return (
        <Suspense
            fallback={
                <main className="min-h-screen bg-black text-white">
                    <div className="flex min-h-screen items-center justify-center">
                        Loading chapter...
                    </div>
                </main>
            }
        >
            <ChapterContent />
        </Suspense>
    );
}